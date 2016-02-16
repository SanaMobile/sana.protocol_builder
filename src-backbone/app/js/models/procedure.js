const ACTIVE_PAGE_CHANGE_EVENT = 'change:activePage';
const Config = require('utils/config');

let App     = require('utils/sanaAppInstance');
let Helpers = require('utils/helpers');
let Pages   = require('collections/pages');
let Page    = require('./page');


let Procedure = Backbone.Model.extend({

    urlRoot: '/api/procedures',

    defaults: function() {
        // These values are only used when we POST /procedures a new procedure
        return {
            'title': i18n.t('Untitled Procedure'),
            'author': i18n.t('No author specified'), // TODO either fetch user's username or let API allow nullable authors
        };
    },

    constructor: function(attributes, options = {}) {
        this.loadDetails = options.loadDetails || false;
        delete options.loadDetails;

        // We do not want the Collection to be an attribute of this model because:
        // - parse() is called before initialize()/defaults() but we need a common reference to the Pages
        // - creating a new Pages inside parse every time causes a lot of headache with event listeners and garbage collection
        // - we'd need to override toJSON() anyways to only return the list of ids
        this.pages = new Pages(null, { parentProcedure: this });

        if (options.activePageId) {
            this.activePageId = parseInt(options.activePageId);
            delete options.activePageId;
        }

        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // Propagate AJAX events from child to this model so that the status bar can be notified
        Helpers.propagateEvents(this.pages, this, ['request', 'sync', 'destroy', 'error']);

        if (Config.DEBUG) {
            this.listenTo(this.pages, 'all', function(event, subject) {
                console.debug('Pages collection event:', event, subject && subject.get('id'));
            });
        }
    },

    parse: function(response, options) {
        response.created       = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this._setPages(response.pages); // At the minimum, this sets a bunch of Page models with only 'id' attribute
        delete response.pages;

        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);
        json.pages = this.pages.pluck('id');
        return json;
    },

    _setPages: function (pages) {
        let self = this;
        let onPageFetch = function(model, response, options) {
            self._setPage(model);
        };

        for (let i = 0; i < pages.length; i++) {
            let page = new Page(pages[i]);
            this.pages.add(page, { silent: true });

            if (this.loadDetails) {
                page.fetch({ 
                    success: onPageFetch,
                });
            }
        }
    },

    _setPage: function(page) {
        // Not silent update because now we have all the info for the view
        page = this.pages.add(page, { merge: true });

        if (page.isActive()) {
            this.selectActivePage(page);
        }
    },

    createNewPage: function() {
        let position = 0;
        if (!_.isEmpty(this.pages.models)) {
            let lastPage = _.max(this.pages.models, page => page.get('display_index'));
            position = lastPage.get('display_index') + 1;
        }

        let page = new Page({
            display_index: position,
            procedure: this.get('id'),
        }, {
            loadDetails: this.loadDetails,
        });

        let self = this;
        page.save({}, {
            success: function() {
                console.info('Created Page', page.get('id'));
                self.pages.add(page);
                self.selectActivePage(page);
            },
            error: function() {
                console.warn('Failed to create Page', page.get('id'));
                App().RootView.showNotification('Failed to create Page!');
            },
        });
    },

    selectActivePage: function(page) {
        this.activePageId = page.get('id');
        this.trigger(ACTIVE_PAGE_CHANGE_EVENT, page);
    },

    unselectActivePage: function() {
        this.activePageId = undefined;
        this.trigger(ACTIVE_PAGE_CHANGE_EVENT, null);
    },

    generate: function() {
        const title = this.get('title');
        $.ajax({
            type: 'GET',
            url: this.url() + '/generate',
            success: function onGenerateSuccess(data, status, jqXHR) {
                const filename = title + '.xml';
                Helpers.downloadXMLFile(data, filename);
            },
            error: function onGenerateError(jqXHR, textStatus, errorThrown) {
                console.warn('Failed to generate Procedure', textStatus);
                App().RootView.showNotification({
                    title: i18n.t('Failed to generate Procedure', { procedureTitle: title }),
                    desc: i18n.t(jqXHR.responseText),
                }, {
                    isTranslated: true
                });
            },
        });
    },

});

Procedure.ACTIVE_PAGE_CHANGE_EVENT = ACTIVE_PAGE_CHANGE_EVENT;

module.exports = Procedure;

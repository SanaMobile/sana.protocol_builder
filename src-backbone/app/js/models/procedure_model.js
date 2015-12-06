var Helpers        = require('utils/helpers');
var Page           = require('models/page_model');
var PageCollection = require('models/page_collection');

const ACTIVE_PAGE_CHANGE_EVENT_KEY = 'change:active_page';


let Procedure = Backbone.Model.extend({

    urlRoot: '/api/procedures',

    defaults: function() {
        // These values are only used when we POST /procedures a new procedure
        return {
            'title': 'Untitled Procedure',
            'author': 'No author specified', // TODO either fetch user's username or let API allow nullable authors
        };
    },

    constructor: function(attributes, options = {}) {
        this.load_details = options.load_details || false;
        delete options.load_details;

        // We do not want the Collection to be an attribute of this model because:
        // - parse() is called before initialize()/defaults() but we need a common reference to the PageCollection
        // - creating a new PageCollection inside parse every time causes a lot of headache with event listeners and garbage collection
        // - we'd need to override toJSON() anyways to only return the list of ids
        this.pages = new PageCollection(null, { parent_procedure: this });

        if (options.active_page_id) {
            this.active_page_id = parseInt(options.active_page_id);
            delete options.active_page_id;
        }

        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // Propagate AJAX events from child to this model so that the status bar can be notified
        Helpers.propagate_events(this.pages, this, ['request', 'sync', 'destroy', 'error']);

        if (DEBUG) {
            this.listenTo(this.pages, 'all', function(event, subject) {
                console.debug('PageCollection event:', event, subject && subject.get('id'));
            });
        }
    },

    parse: function(response, options) {
        response.created       = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this.set_pages(response.pages); // At the minimum, this sets a bunch of Page models with only 'id' attribute
        delete response.pages;

        return response;
    },

    toJSON: function() {
        var json = _.clone(this.attributes);
        json.pages = this.pages.pluck('id');
        return json;
    },

    set_pages: function (page_ids) {
        let self = this;
        let on_page_fetch = function(model, response, options) {
            // Not silent update because now we have all the info for the view
            model = self.pages.add(model, { merge: true });

            if (model.is_active()) {
                self.select_active_page(model);
            }
        };

        for (var i = 0; i < page_ids.length; i++) {
            let page = new Page({ 
                id: page_ids[i],
                display_index: i,
            });

            this.pages.add(page, { silent: true });

            if (this.load_details) {
                page.fetch({ success: on_page_fetch });
            }
        }
    },

    create_new_page: function() {
        var display_index = 0;
        if (!_.isEmpty(this.pages.models)) {
            let lowest_page = _.max(this.pages.models, page => page.get('display_index'));
            display_index = lowest_page.get('display_index') + 1;
        }

        var page = new Page({
            display_index: display_index,
            procedure: this.get('id'),
        }, {
            load_details: this.load_details,
        });

        var self = this;
        page.save({}, {
            success: function() {
                console.info('Created Page', page.get('id'));
                self.pages.add(page);
                self.select_active_page(page);
            },
            error: function() {
                console.warn('Failed to create Page', page.get('id'));
                // TODO show error alert
            },
        });
    },

    select_active_page: function(page_model) {
        this.active_page_id = page_model.get('id');
        this.trigger(ACTIVE_PAGE_CHANGE_EVENT_KEY, page_model);
    },

    unselect_active_page: function() {
        this.active_page_id = undefined;
        this.trigger(ACTIVE_PAGE_CHANGE_EVENT_KEY, null);
    },

});

Procedure.ACTIVE_PAGE_CHANGE_EVENT_KEY = ACTIVE_PAGE_CHANGE_EVENT_KEY;

module.exports = Procedure;

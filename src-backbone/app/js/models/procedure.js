const ACTIVE_PAGE_CHANGE_EVENT = 'change:activePage';
const Config = require('utils/config');

let App     = require('utils/sanaAppInstance');
let Helpers = require('utils/helpers');
let Pages   = require('collections/pages');
let Page    = require('./page');


let Procedure = Backbone.Model.extend({

    urlRoot: '/api/procedures',

    defaults: function() {
        let user = App().session.user;

        // These values are only used when we POST /procedures a new procedure
        return {
            'title': i18n.t('Untitled Procedure'),
            'author': user.get('first_name') + ' ' + user.get('last_name'),
        };
    },

    constructor: function(attributes, options = {}) {
        // We do not want the Collection to be an attribute of this model because:
        // - parse() is called before initialize()/defaults() but we need a common reference to the Pages
        // - creating a new Pages inside parse every time causes a lot of headache with event listeners and garbage collection
        // - we'd need to override toJSON() anyways to only return the list of ids
        this.pages = new Pages(null, { parentProcedure: this });

        if (options.activePageId) {
            this.activePageId = parseInt(options.activePageId);
            delete options.activePageId;
        }

        // Propagate AJAX events from child to this model so that the status bar can be notified
        this.listenTo(this.pages, 'add', function(model, collection, options) {
            Helpers.propagateEvents(model, this);
        });
        this.listenTo(this.pages, 'reset', function(collection, options) {
            for (let model of collection.models) {
                Helpers.propagateEvents(model, this);
            }
        });

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    parse: function(response, options) {
        if (_.has(response, 'created')) {
            response.created = new Date(Date.parse(response.created));
        }

        if (_.has(response, 'last_modified')) {
            response.last_modified = new Date(Date.parse(response.last_modified));
        }

        this._setPages(response.pages);
        delete response.pages;

        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);
        json.pages = this.pages.pluck('id');
        return json;
    },

    _setPages: function (pages) {
        this.pages.reset(pages, { parse: true });

        let activePage = this.pages.findWhere(function(page) {
            return page.isActive();
        });

        if (activePage) {
            this.selectActivePage(activePage);
        }
    },

    //--------------------------------------------------------------------------
    // Managing activePageId
    //--------------------------------------------------------------------------

    selectActivePage: function(page) {
        this.activePageId = page.get('id');
        this.trigger(ACTIVE_PAGE_CHANGE_EVENT, page);
    },

    unselectActivePage: function() {
        this.activePageId = undefined;
        this.trigger(ACTIVE_PAGE_CHANGE_EVENT, null);
    },

    getActivePage: function() {
        return this.pages.get(this.activePageId);
    },

    //--------------------------------------------------------------------------
    // View events
    //--------------------------------------------------------------------------

    createNewPage: function() {
        let position = 0;
        if (!_.isEmpty(this.pages.models)) {
            let lastPage = _.max(this.pages.models, page => page.get('display_index'));
            position = lastPage.get('display_index') + 1;
        }

        let page = new Page({
            display_index: position,
            procedure: this.get('id'),
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

    _preprocessNodes(pages) {
        const nodes = [];
        const pageElementIndexToNodeIndex = new Map();
        const elementIdToNodeIndex = new Map();

        pages.forEach((page, i) => {
            const elements = page.elements.models;
            elements.forEach((element, j) => {
                nodes.push({
                    label: element.get('question'),
                    page: i
                });
                pageElementIndexToNodeIndex.set(`${i},${j}`, nodes.length - 1);
                elementIdToNodeIndex.set(element.id, nodes.length - 1);

                if (j === 0) {
                    pageElementIndexToNodeIndex.set(`start${i}`, nodes.length - 1);
                }
            });
        });

        return { nodes, pageElementIndexToNodeIndex, elementIdToNodeIndex };
    },

    generateGraph() {
        const pages = this.pages;

        if (pages.length > 0) {
            const { nodes, pageElementIndexToNodeIndex, elementIdToNodeIndex } = this._preprocessNodes(pages);

            const linearEdges = [];
            for (let i = 1; i < nodes.length; i++) {
                linearEdges.push([i - 1, i]);
            }

            const conditionalEdges = [];
            for (let i = 1; i < pages.length; i++) {
                const page = pages.at(i);

                const dependencies = this._getDependencies(page);
                const pageIndex = pageElementIndexToNodeIndex.get(`start${i}`);

                dependencies.forEach(id => {
                    const dependencyIndex = elementIdToNodeIndex.get(id);
                    conditionalEdges.push([pageIndex, dependencyIndex]);
                });
            }

            return { nodes, linearEdges, conditionalEdges };
        }
        else {
            return { nodes: [], linearEdges: [], conditionalEdges: [] };
        }
    },

    _getDependencies(page) {
        const criteriaElements = new Set();

        const recursiveGetCriteriaElement = (node) => {
            const criteriaElement = node.get('criteria_element');
            if (criteriaElement && criteriaElement > 0) {
                criteriaElements.add(criteriaElement);
            }

            const children = node.childrenNodes.models;
            children.forEach(recursiveGetCriteriaElement);
        };

        const showIfs = page.showIfs.models;
        showIfs.forEach(showIf => {
            const { rootConditionalNode } = showIf;
            recursiveGetCriteriaElement(rootConditionalNode);
        });

        return criteriaElements;
    },
});

Procedure.ACTIVE_PAGE_CHANGE_EVENT = ACTIVE_PAGE_CHANGE_EVENT;

module.exports = Procedure;

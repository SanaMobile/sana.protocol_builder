const Config = require('utils/config');
const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

const Elements = require('collections/elements');
const Element = require('models/element');
const ShowIfs = require('collections/conditionals/showIfs');
const ShowIf = require('models/conditionals/showIf');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/pages',

    constructor: function(attributes, options = {}) {
        // See model/procedure.js for explaination
        this.elements = new Elements(null, { parentPage: this });
        this.showIfs = new ShowIfs(null, { parentPage: this });

        // A cache that maps this page's Criteria Elements to their original pages
        this.dependentPageCache = new Map();

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // Propagate AJAX events from child to this model so that the status bar can be notified
        this.listenTo(this.elements, 'add', function(model, collection, options) {
            Helpers.propagateEvents(model, this);
        });
        this.listenTo(this.elements, 'reset', function(collection, options) {
            for (let model of collection.models) {
                Helpers.propagateEvents(model, this);
            }
        });
        this.listenTo(this.showIfs, 'add', function(model, collection, options) {
            Helpers.propagateEvents(model, this);
        });
        this.listenTo(this.showIfs, 'reset', function(collection, options) {
            for (let model of collection.models) {
                Helpers.propagateEvents(model, this);
            }
        });

        // When the Procedure has finished loading all the Pages, need to regenerate
        // all of this Page's dependents
        this.listenTo(this.collection, 'reset', function() {
            this._computeDependentPages();
        });
    },

    parse: function(response, options) {
        response.created = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this.elements.reset(response.elements, { parse: true });
        delete response.elements;

        this.showIfs.reset(response.show_if, { parse: true });
        delete response.show_if;

        return response;
    },

    //--------------------------------------------------------------------------
    // View events
    //--------------------------------------------------------------------------

    createNewElement: function(type) {
        let position = 0;
        if (!_.isEmpty(this.elements.models)) {
            let lastElement = _.max(this.elements.models, element => element.get('display_index'));
            position = lastElement.get('display_index') + 1;
        }

        let element = new Element({
            display_index: position,
            page: this.get('id'),
            element_type: type,
        });

        let self = this;
        element.save({}, {
            beforeSend: function() {
                console.info('Creating Element');
                self.trigger('request');
            },
            success: function() {
                console.info('Created Element', element.get('id'));
                self.elements.add(element);
            },
            error: function() {
                console.warn('Failed to create Element', element.get('id'));
                App().RootView.showNotification('Failed to create Element!');
            },
        });
    },

    createNewCriteria: function() {
        let showIf = new ShowIf({
            page: this.get('id'),
            conditions: {
                node_type: 'EQUALS',
            },
        }, {
            parentPage: this,
        });

        let self = this;
        let pageId = this.get('id');
        showIf.save({}, {
            beforeSend: function() {
                console.info('Creating Criteria');
                self.trigger('request');
            },
            success: function() {
                console.info('Created Criteria', showIf.get('id'));
                self.showIfs.reset([ showIf ], { parse: true });
            },
            error: function() {
                console.warn('Failed to create Criteria', showIf.get('id'));
                App().RootView.showNotification('Failed to create Criteria!');
            },
        });
    },

    clearCriteria: function() {
        for (let model of this.showIfs.models) {
            model.destroy();
        }
    },

    shouldConfirmBeforeSort: function(newIndex) {
        let self = this;
        let clearAllCriteria = function() {
            self.clearCriteria();
        };
        let clearElementsFromCriteria = function() {
            self._clearDependentElementsAfterPosition(newIndex);
        };

        if (this.showIfs.length === 0) {
            // Don't need to warn user if there's no side effects to sorting
            return false;
        }

        if (newIndex === 0) {
            // Moving to first slot always remove all conditions
            return {
                warningMessage: i18n.t("Reordering this page will remove all of your conditionals."),
                callback: clearAllCriteria,
            };
        }

        let oldIndex = this.get('display_index');
        if (oldIndex < newIndex) {
            // Moving to a slot below current slot won't invalidate any conditions
            return false;
        }

        // When newIndex < oldIndex, then there may be pages inbetween that contain
        // elements that this page depends on
        let dependentPages = this.dependentPageCache.values();
        for (let dependentPage of dependentPages) {
            if (!dependentPage) {
                break;
            }

            let dependentPageIndex = dependentPage.get('display_index');
            if (dependentPageIndex >= newIndex) {
                // Dependant appears after this page so warn the user
                return {
                    warningMessage: i18n.t("Reordering this page will cause some of your conditionals to lose their dependent elements because they appear after this page's new location."),
                    callback: clearElementsFromCriteria,
                };
            }
        }

        return false;
    },

    //--------------------------------------------------------------------------
    // Template helpers
    //--------------------------------------------------------------------------

    isActive: function() {
        let activePageId = this.collection.parentProcedure.activePageId;
        return _.isNumber(activePageId) && this.get('id') === activePageId;
    },

    canHaveConditions: function() {
        return this.get('id') !== this.collection.at(0).get('id');
    },

    getPossibleOperandElements: function() {
        let myDisplayIndex = this.get('display_index');
        let pagesBeforeMe = this.collection.filter(function(page) {
            return page.get('display_index') < myDisplayIndex;
        });

        let elementsByPage = [];

        for (let page of pagesBeforeMe) {
            let pageElements = [];

            for (let element of page.elements.models) {
                let attributes = _.clone(element.attributes);
                attributes.question = attributes.question || i18n.t(element.get('element_type'));
                pageElements.push(element.attributes);
            }

            elementsByPage.push({
                pageLabel: i18n.t('Page displayIndex', { displayIndex: (page.get('display_index') + 1) }),
                pageElements: pageElements,
            });
        }

        return elementsByPage;
    },

    //--------------------------------------------------------------------------
    // Misc helpers
    //--------------------------------------------------------------------------

    _computeDependentPages: function() {
        this.dependentPageCache.clear();

        if (this.showIfs.length === 0 || // Page with no conditions
            !this.collection) {          // Page model is about to be destroyed (on a collection reset)
            return;
        }

        // WARNING:
        // This method is quite slow and can stall the UI thread when there's
        // more than 10 ConditionalNodes. Use this method sparingly

        let dependentElements = this.showIfs.at(0).rootConditionalNode.getDependentElements();

        for (let elementId of dependentElements) {
            let dependentPage = this.collection.find(function(page) {
                return !!page.elements.get(elementId);
            });

            this.dependentPageCache.set(elementId, dependentPage);
        }

        console.log('onReset', this.dependentPageCache);
    },

    _clearDependentElementsAfterPosition: function(position) {
        if (this.showIfs.length === 0) { // Page with no conditions
            return;
        }

        this.showIfs.at(0).rootConditionalNode.clearDependentElementsAfterPosition(position);
    },

});

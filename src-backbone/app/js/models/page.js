const Config = require('utils/config');
const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');
const CountedMap = require('utils/countedMap');

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
        this.dependentElementsToPage = new CountedMap();

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

        options.parse = true;
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // When the Procedure has finished loading all the Pages, need to regenerate
        // all of this Page's dependents
        this.listenTo(this.collection, 'reset', function() {
            if (!this.collection) {
                this.stopListening(); // Model is about to be destroyed
                return;
            }

            this._computeDependentPages();
        });
    },

    destroy: function(options) {
        let myDisplayIndex = this.get('display_index');
        let pagesAfterMe = this.collection.filter(function(page) {
            return page.get('display_index') > myDisplayIndex;
        });

        if (this.collection.at(0) === this && pagesAfterMe.length > 0) {
            let pageOne = this.collection.at(1);
            if (pageOne.showIfs.length > 0) {
                if (!confirm("Deleting this page will cause the second page to lose their conditionals. Are you sure you wish to continue?")) {
                    return;
                }

                pageOne.clearCriteria();
            }
        }

        for (let page of pagesAfterMe) {
            page._clearDependentElementsFromPage(this.get('id'));
        }

        Backbone.Model.prototype.destroy.call(this, options);
    },

    parse: function(response, options) {
        if (_.has(response, 'created')) {
            response.created = new Date(Date.parse(response.created));
        }

        if (_.has(response, 'last_modified')) {
            response.last_modified = new Date(Date.parse(response.last_modified));
        }

        this.elements.reset(response.elements, { parse: true });
        delete response.elements;

        this.showIfs.reset(response.show_if, { parse: true });
        delete response.show_if;

        return response;
    },

    //--------------------------------------------------------------------------
    // View events
    //--------------------------------------------------------------------------

    importElementsFromConcept: function(concept) {
        let position = 0;
        if (!_.isEmpty(this.elements.models)) {
            let lastElement = _.max(this.elements.models, element => element.get('display_index'));
            position = lastElement.get('display_index') + 1;
        }

        let self = this;
        concept.elements.each(function(abstractElement) {
            self._createFromAbstractElement(abstractElement, position);
            position += 1;
        });
    },

    createNewElement: function(concept, type) {
        let position = 0;
        if (!_.isEmpty(this.elements.models)) {
            let lastElement = _.max(this.elements.models, element => element.get('display_index'));
            position = lastElement.get('display_index') + 1;
        }

        let conceptId = null;
        if (concept) {
            conceptId = concept.get('id');
        }

        let element = new Element({
            display_index: position,
            page: this.get('id'),
            // question: concept.get('description'),
            concept: conceptId,
            element_type: type,
        });

        this._saveElement(element);
    },

    _createFromAbstractElement: function(abstractElement, position) {
        let json = abstractElement.toJSON();
        json.display_index = position;
        json.page = this.get('id');
        delete json.id;

        const element = new Element(json);

        this._saveElement(element);
    },

    _saveElement: function(element) {
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

        this.dependentElementsToPage.clear();
        this.save();
    },

    shouldConfirmBeforeSort: function(newIndex) {
        let oldIndex = this.get('display_index');
        let message;

        message = this._checkPagesBelowMeBeforeSort(oldIndex, newIndex);
        if (message) {
            return message;
        }

        message = this._checkPagesAboveMeBeforeSort(oldIndex, newIndex);
        if (message) {
            return message;
        }

        return false;
    },

    _checkPagesBelowMeBeforeSort: function(oldIndex, newIndex) {
        // Moving to a slot below current slot won't invalidate any conditions on this page
        // BUT it may invalidate some conditions on other pages
        if (oldIndex < newIndex) {
            let pagesAfterMe = this.collection.filter(function(page) {
                return page.get('display_index') > oldIndex && page.get('display_index') <= newIndex;
            });
            let pagesAfterMeDependingOnMe = [];

            for (let page of pagesAfterMe) {
                for (let myElement of this.elements.models) {
                    if (page.dependentElementsToPage.has(myElement.get('id'))) {
                        pagesAfterMeDependingOnMe.push(page);
                    }
                }
            }

            if (pagesAfterMeDependingOnMe.length > 0) {
                let self = this;
                return {
                    warningMessage: i18n.t("Reordering this page will cause some of your other pages' conditionals to lose their dependent elements because they appear before this page's new location."),
                    callback: function() {
                        for (let page of pagesAfterMeDependingOnMe) {
                            page._clearDependentElementsFromPage(self.get('id'));
                        }
                    },
                };
            }
        }

        if (this.collection.at(0) === this) {
            let pageOne = this.collection.at(1);
            if (pageOne.showIfs.length > 0) {
                return {
                    warningMessage: i18n.t("Reordering this page will cause some of your other pages' conditionals to lose their dependent elements because they appear before this page's new location."),
                    callback: function() {
                        pageOne.clearCriteria();
                    },
                };
            }
        }

        return false;
    },

    _checkPagesAboveMeBeforeSort: function(oldIndex, newIndex) {
        // When newIndex < oldIndex (moving page up), then there may be pages inbetween that contain
        // elements that this page depends on
        if (this.showIfs.length === 0) {
            // Don't need to warn user if there's no side effects to sorting
            return false;
        }

        let self = this;
        let clearAllCriteria = function() {
            self.clearCriteria();
        };
        let clearElementsFromCriteria = function() {
            self._clearDependentElementsAfterPosition(newIndex);
        };

        if (newIndex === 0) {
            // Moving to first slot always remove all conditions
            return {
                warningMessage: i18n.t("Reordering this page will remove all of your conditionals."),
                callback: clearAllCriteria,
            };
        }

        let dependentPages = this.dependentElementsToPage.values();
        for (let dependentPage of dependentPages) {
            if (!dependentPage) {
                break;
            }

            let dependentPageIndex = dependentPage.item.get('display_index');
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

    isBeingDependedUpon: function() {
        if (!this.collection.parentProcedure.activePageId) {
            // No active page so nobody is depending on me
            return false;
        }

        let activePage = this.collection.parentProcedure.getActivePage();
        for (let element of this.elements.models) {
            if (activePage.dependentElementsToPage.has(element.get('id'))) {
                return true;
            }
        }

        return false;
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
                if (element.isPluginBased()) {
                    // Plugin-based elements do not have any answers so they cannot be compared
                    continue;
                }

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
        this.dependentElementsToPage.clear();

        if (this.showIfs.length === 0) { // Page with no conditions
            return;
        }

        // WARNING:
        // This method is quite slow and can stall the UI thread when there's
        // more than 10 ConditionalNodes. Use this method sparingly

        let dependentElements = this.showIfs.at(0).rootConditionalNode.getDependentElements();

        for (let elementId of dependentElements) {
            this._computeDependentPage(elementId);
        }

        console.log('onReset', this.dependentElementsToPage);
    },

    _computeDependentPage: function(elementId) {
        let dependentPage = this.collection.find(function(page) {
            return !!page.elements.get(elementId);
        });

        this.dependentElementsToPage.set(elementId, dependentPage);
    },

    _clearDependentElementsAfterPosition: function(position) {
        if (this.showIfs.length === 0) { // Page with no conditions
            return;
        }

        this.showIfs.at(0).rootConditionalNode.clearDependentElementsAfterPosition(position);
    },

    _clearDependentElementsFromPage: function(pageId) {
        if (this.showIfs.length === 0) { // Page with no conditions
            return;
        }

        this.showIfs.at(0).rootConditionalNode.clearDependentElementsFromPage(pageId);
    },

});

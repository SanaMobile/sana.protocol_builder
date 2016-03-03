const Config = require('utils/config');
const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

const Elements = require('collections/elements');
const Element = require('models/element');
const ShowIfs = require('collections/conditionals/showIfs');
const ShowIf = require('models/conditionals/showIf');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/pages',

    constructor: function(attributes, options) {
        // See model/procedure.js for explaination
        this.elements = new Elements(null, { parentPage: this });
        this.showIfs = new ShowIfs(null, { parentPage: this });

        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // Propagate AJAX events from child to this model so that the status bar can be notified

        let self = this;
        this.listenTo(this.elements, 'add', function(model, collection, options) {
            Helpers.propagateEvents(model, self);
        });
        this.listenTo(this.elements, 'reset', function(collection, options) {
            for (let model of collection.models) {
                Helpers.propagateEvents(model, self);
            }
        });

        this.listenTo(this.showIfs, 'add', function(model, collection, options) {
            Helpers.propagateEvents(model, self);
        });
        this.listenTo(this.showIfs, 'reset', function(collection, options) {
            for (let model of collection.models) {
                Helpers.propagateEvents(model, self);
            }
        });
    },

    parse: function(response, options) {
        response.created = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this.elements.reset(response.elements);
        delete response.elements;

        this.showIfs.reset(response.show_if);
        delete response.show_if;
        
        return response;
    },

    isActive: function() {
        let activePageId = this.collection.parentProcedure.activePageId;
        return _.isNumber(activePageId) && this.get('id') === activePageId;
    },

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
                self.showIfs.reset([showIf]);
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

    canHaveConditions: function() {
        return this.get('id') !== this.collection.at(0).get('id');
    },

    getConditionalOperandElements: function() {
        let myDisplayIndex = this.get('display_index');
        let pagesBeforeMe = this.collection.filter(function(page) {
            return page.get('display_index') < myDisplayIndex;
        });

        let operandElements = [];

        for (let page of pagesBeforeMe) {
            let pageElements = [];

            for (let element of page.elements.models) {
                let attributes = _.clone(element.attributes);
                attributes.question = attributes.question || i18n.t(element.get('element_type'));
                pageElements.push(element.attributes);
            }

            operandElements.push({
                pageLabel: i18n.t('Page displayIndex', { displayIndex: (page.get('display_index') + 1) }),
                pageElements: pageElements,
            });
        }

        return operandElements;
    },

});

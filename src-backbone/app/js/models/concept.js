const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

const AbstractElement = require('models/abstractElement');
const AbstractElementCollection = require('collections/abstractElements');

module.exports = Backbone.Model.extend({

    urlRoot: '/api/concepts',

    constructor: function(attributes, options = {}) {
        // See model/procedure.js for explaination
        this.elements = new AbstractElementCollection(null, null);
        this.selected = false;

        // Propagate AJAX events from child to this model so that the status bar can be notified
        this.listenTo(this.elements, 'add', function(model, collection, options) {
            Helpers.propagateEvents(model, this);
        });
        this.listenTo(this.elements, 'reset', function(collection, options) {
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

        this.elements.reset(response.abstractelements, { parse: true });
        delete response.elements;

        return response;
    },

    createNewElement: function(type) {
        let position = 0;
        if (!_.isEmpty(this.elements.models)) {
            let lastElement = _.max(this.elements.models, element => element.get('display_index'));
            position = lastElement.get('display_index') + 1;
        }

        let element = new AbstractElement({
            display_index: position,
            concept: this.get('id'),
            element_type: type,
        });

        let self = this;
        element.save({}, {
            beforeSend: function() {
                console.info('Creating Abstract Element');
                self.trigger('request');
            },
            success: function() {
                console.info('Created Abstract Element', element.get('id'));
                self.elements.add(element);
            },
            error: function() {
                console.warn('Failed to create Abstract Element', element.get('id'));
                App().RootView.showNotification('Failed to create Abstract Element!');
            },
        });
    },

    isSelected: function() {
        return this.selected;
    },

    setSelected: function(selected) {
        this.selected = selected;
    }

});

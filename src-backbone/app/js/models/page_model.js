let Helpers           = require('utils/helpers');
let ElementCollection = require('models/element_collection');
let Element           = require('models/element_model');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/pages',

    constructor: function(attributes, options = {}) {
        // See procedure_model.js for explaination
        this.elements = new ElementCollection(null, { parent_page: this });
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // Propagate AJAX events from child to this model so that the status bar can be notified
        Helpers.propagate_events(this.elements, this, ['request', 'sync', 'destroy', 'error']);

        if (DEBUG) {
            this.listenTo(this.elements, 'all', function(event, subject) {
                console.debug('ElementCollection event:', event, subject && subject.get('id'));
            });
        }
    },

    parse: function(response, options) {
        response.created       = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this.elements.reset(response.elements);
        delete response.elements;
        
        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);
        json.elements = this.elements.toJSON();
        return json;
    },

    is_active: function() {
        let active_page_id = this.collection.parent_procedure.active_page_id;
        return _.isNumber(active_page_id) && this.get('id') === active_page_id;
    },

    create_new_element: function(element_type) {
        let display_index = 0;
        if (!_.isEmpty(this.elements.models)) {
            let last_element = _.max(this.elements.models, element => element.get('display_index'));
            display_index = last_element.get('display_index') + 1;
        }

        let element = new Element({
            display_index: display_index,
            page: this.get('id'),
            element_type: element_type,
        });

        let self = this;
        element.save({}, {
            success: function() {
                console.info('Created Element', element.get('id'));
                self.elements.add(element);
            },
            error: function() {
                console.warn('Failed to create Element', element.get('id'));
                // TODO show error alert
            },
        });
    },

});

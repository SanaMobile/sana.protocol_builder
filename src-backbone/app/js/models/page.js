const Config = require('utils/config');

let App      = require('utils/sanaAppInstance');
let Helpers  = require('utils/helpers');
let Elements = require('collections/elements');
let Element  = require('models/element');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/pages',

    constructor: function(attributes, options = {}) {
        // See model/procedure.js for explaination
        this.elements = new Elements(null, { parentPage: this });
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        // Propagate AJAX events from child to this model so that the status bar can be notified
        Helpers.propagateEvents(this.elements, this, ['request', 'sync', 'destroy', 'error']);

        if (Config.DEBUG) {
            this.listenTo(this.elements, 'all', function(event, subject) {
                console.debug('Elements collection event:', event, subject && subject.get('id'));
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
            success: function() {
                console.info('Created Element', element.get('id'));
                self.elements.add(element);
            },
            error: function() {
                console.warn('Failed to create Element', element.get('id'));
                App().showNotification('danger', 'Failed create Element!');
            },
        });
    },

});

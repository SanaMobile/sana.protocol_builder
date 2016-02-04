const Choices = require('collections/choices');
const Choice = require('models/choice');
const Config = require('utils/config');
const Helpers = require('utils/helpers');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/elements',

    constructor: function(attributes, options = {}) {
        // See model/procedure.js for explaination
        this.choices = new Choices(null, {
            parentElement: this,
            allowMultipleAnswers: (attributes.element_type === 'MULTI_SELECT'),
        });
        attributes = this.parse(attributes);

        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        let self = this;
        this.choices.on('change', function() {
            self.save();
        });
        this.choices.on('destroy', function() {
            self.save();
        });

        if (Config.DEBUG) {
            this.listenTo(this.choices, 'all', function(event, subject) {
                console.debug('Choices collection event:', event, subject && subject.get('text'));
            });
        }
    },

    parse: function(response, options) {
        response.created       = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this.choices.setAnswers(response.choices, response.answer);
        delete response.choices;
        delete response.answer;

        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);
        json.answer = this.choices.getDefaultAnswer();
        json.choices = this.choices.getAnswers();
        return json;
    },

    createNewChoice: function(text) {
        return this.choices.add(new Choice({
            text: text,
            choiceDisplayIndex: _.max(this.choices.models, m => m.get('choiceDisplayIndex')) + 1,
        }));
    },

});

const Choices = require('collections/choices');
const Choice = require('models/choice');
const Config = require('utils/config');
const Helpers = require('utils/helpers');


module.exports = Backbone.Model.extend({

    urlRoot: '/api/elements',

    constructor: function(attributes, options) {
        // See model/procedure.js for explaination
        this.choices = new Choices(null, {
            parentElement: this,
            allowMultipleAnswers: (attributes.element_type === 'MULTI_SELECT'),
        });

        this.debounceSave = _.debounce(function() {
            this._debounceSave.apply(this, arguments);
        }, Config.INPUT_DELAY_BEFORE_SAVE);

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
            let elementId = this.get('id');
            this.listenTo(this.choices, 'all', function(event, subject) {
                console.log('Element', elementId, 'ChoicesCollection event:', event, subject && subject.get('text'));
            });
        }
    },

    parse: function(response, options) {
        response.created       = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        this.choices.setAnswers(response.choices, response.answer);
        delete response.choices;

        return response;
    },

    toJSON: function() {
        let json = _.clone(this.attributes);

        if (!json.answer) {
            json.answer = this.choices.getDefaultAnswer();
        }

        // TODO organize this...

        let elementType = this.get('element_type');
        if (Config.CHOICE_ELEMENT_TYPES.includes(elementType)) {
            json.choices = this.choices.getAnswers();
        }
        if (!Config.PLUGIN_ELEMENT_TYPES.includes(elementType)) {
            delete json.action;
            delete json.mime_type;
        }

        return json;
    },

    createNewChoice: function(text) {
        return this.choices.add(new Choice({
            text: text,
            choiceDisplayIndex: _.max(this.choices.models, m => m.get('choiceDisplayIndex')) + 1,
        }));
    },

    _debounceSave: function(attributes, options = {}) {
        let self = this;
        let logSaveOptions = {
            beforeSend: function() {
                console.info('Saving Element', self.get('id'));
            },
            success: function() {
                console.info('Saved Element', self.get('id'));
            },
            error: function() {
                console.error('Unable to save Element changes', self.get('id'));
            },
        };

        $.extend(options, logSaveOptions);
        this.save(attributes, options);
    },

});

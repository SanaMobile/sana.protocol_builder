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

        this.debounceSave = _.debounce(function() {
            this._debounceSave.apply(this, arguments);
        }, Config.INPUT_DELAY_BEFORE_SAVE);

        options.parse = true;
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
    },

    parse: function(response, options) {
        response.created = new Date(Date.parse(response.created));
        response.last_modified = new Date(Date.parse(response.last_modified));

        if (Config.CHOICE_ELEMENT_TYPES.includes(response.element_type)) {
            this.choices.setChoices(response.choices, response.answer);
            delete response.choices;
            delete response.answer;
        } else {
            response.answer = (response.answer && response.answer.length === 1) ? response.answer[0] : '';
        }

        return response;
    },

    toJSON: function() {
        let json = _.pick(this.attributes,
            'id',
            'eid',
            'display_index',
            'concept',
            'page',
            'element_type',
            'question',
            'required'
        );

        let elementType = this.get('element_type');

        if (Config.CHOICE_ELEMENT_TYPES.includes(elementType)) {
            json.choices = this.choices.pluck('text');
            json.answer = this.choices.getDefaultAnswers();
        } else {
            json.answer = [
                this.get('answer')
            ];
        }

        if (Config.PLUGIN_ELEMENT_TYPES.includes(elementType)) {
            json.action = this.get('action');
            json.mime_type = this.get('mime_type');
        }

        return json;
    },

    createNewChoice: function(text) {
        return this.choices.add(new Choice({
            text: text,
            choiceDisplayIndex: _.max(this.choices.pluck('choiceDisplayIndex')) + 1,
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

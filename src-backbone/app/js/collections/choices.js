const Choice = require('models/choice');


module.exports = Backbone.Collection.extend({

    model: Choice,

    constructor: function(models, options) {
        this.parentElement = options.parentElement;
        delete options.parentElement;

        this.allowMultipleAnswers = options.allowMultipleAnswers;
        delete options.allowMultipleAnswers;

        this.comparator = 'choiceDisplayIndex';
        Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    initialize: function() {
        let self = this;

        this.on('change:isDefault', function turnOffOtherAnswers(activeChoice) {
            if (self.allowMultipleAnswers) {
                return;
            }
            if (!activeChoice.get('isDefault')) {
                return;
            }

            for (let model of self.models) {
                if (model.cid !== activeChoice.cid) {
                    model.set('isDefault', false);
                }
            }
        });
    },

    setAnswers: function(modelTexts, defaultAnswer) {
        if (!modelTexts) {
            return;
        }

        for (let modelText of modelTexts) {
            let existingModel = this.findWhere({ text: modelText });
            if (existingModel) {
                let isDefault = (existingModel.get('text') === defaultAnswer);
                existingModel.set('isDefault', isDefault);
                continue;
            }

            this.add(new Choice({
                text: modelText,
                isDefault: (modelText === defaultAnswer), // TODO handle multi-choice's possiblity of multiple defualt answers
            }));
        }
    },

    getAnswers: function() {
        return this.pluck('text');
    },

    getDefaultAnswer: function() {
        const defaultChoice = this.findWhere({ isDefault: true }); // TODO handle multiple default answers on backend
        return defaultChoice ? defaultChoice.get('text') : '';
    },

});

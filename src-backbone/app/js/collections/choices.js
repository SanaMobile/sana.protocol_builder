const Choice = require('models/choice');
const SortableBehavior = require('behaviors/sortableBehavior');


module.exports = Backbone.Collection.extend({

    model: Choice,

    constructor: function(models, options) {
        this.parentElement = options.parentElement;
        delete options.parentElement;

        this.allowMultipleAnswers = options.allowMultipleAnswers;
        delete options.allowMultipleAnswers;

        this.comparator = 'choiceDisplayIndex';
        this.on(SortableBehavior.ON_SORT_EVENT, function() {
            this.parentElement.save();
        });

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

    setChoices: function(choices, defaultAnswers) {
        if (!choices) {
            return;
        }

        for (let choice of choices) {
            let isDefault = defaultAnswers.includes(choice);

            // Need to manually merge the choice because there's no way to uniquely identify choices (no ids)
            let existingModel = this.findWhere({ text: choice });
            if (existingModel) {
                existingModel.set('isDefault', isDefault);
                continue;
            }

            this.add(new Choice({
                text: choice,
                isDefault: isDefault,
            }));
        }
    },

    getDefaultAnswers: function() {
        return this.where({ isDefault: true }).map(choice => choice.get('text'));
    },

});

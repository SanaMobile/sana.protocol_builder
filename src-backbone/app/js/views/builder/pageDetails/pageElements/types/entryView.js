module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/types/entryView'),

    ui: {
        'answer': 'input.answer'
    },

    events: {
        'keyup @ui.answer': '_onEntryFormChanged',
    },

    _onEntryFormChanged: function(event) {
        let answer = this.ui.answer.val();

        this.model.debounceSave({
            answer: answer,
        });
    },

});

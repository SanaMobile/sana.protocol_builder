module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageElements/types/entryView'),

    ui: {
        'answer': 'input.answer'
    },

    triggers: {
        'keyup @ui.answer': 'update_answer'
    },
});

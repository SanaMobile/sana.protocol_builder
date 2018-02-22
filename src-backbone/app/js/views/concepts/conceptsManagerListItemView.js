const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/concepts/conceptsManagerListItemView'),

    tagName: 'li',
    className: 'concept',

    ui: {
        'popoverHandle': 'span.shown-conditionally'
    },

    triggers: {
        'click a.concept': 'concept:select',
        'click a.delete': 'concept:delete',
    },

    templateHelpers: function() {
        return {
            isSelected: this.model.isSelected(),
        };
    },
});

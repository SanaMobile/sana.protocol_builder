const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/subroutines/subroutinesListItemView'),

    tagName: 'li',
    className: 'subroutine',

    ui: {
        'popoverHandle': 'span.shown-conditionally'
    },

    triggers: {
        'click a.subroutine': 'subroutine:select',
        'click a.delete': 'subroutine:delete',
    },

    templateHelpers: function() {
        return {
            isSelected: this.model.isSelected(),
        };
    },
});

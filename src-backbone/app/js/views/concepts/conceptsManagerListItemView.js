const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/concepts/conceptsManagerListItemView'),

    tagName: 'li',
    className: 'concept',

    ui: {
        'popoverHandle': 'span.shown-conditionally'
    },

    events: {
        'click a.delete': '_onDeleteConcept',
        'click a.page': '_onSelectConcept',
    },

    _onDeleteConcept: function(event) {

    },

    _onSelectConcept: function(event) {

    },

});
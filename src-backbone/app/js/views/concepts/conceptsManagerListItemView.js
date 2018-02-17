const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/concepts/conceptsManagerListItemView'),

    tagName: 'li',

    ui: {
        'concept': 'td.concept',
    },

    // events: {
    //     'click @ui.concept': '_onClickConcept',
    // },

    _onClickConcept: function(event) {

    },

});
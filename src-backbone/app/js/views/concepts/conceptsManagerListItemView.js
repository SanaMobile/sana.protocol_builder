const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/concepts/conceptsManagerListItemView'),

    tagName: 'li',
    className: 'concept',

    // ui: {
    //     'concept': 'td.concept',
    // },

    //     className: 'page',

    ui: {
        'popoverHandle': 'span.shown-conditionally'
    },

    // events: {
    //     'click a.delete': '_onDeletePage',
    //     'click a.page': '_onSelectPage',
    // },

    regions: {
        // 'conditions': 'ul.conditions',
    },

    // events: {
    //     'click @ui.concept': '_onClickConcept',
    // },

    _onClickConcept: function(event) {

    },

});
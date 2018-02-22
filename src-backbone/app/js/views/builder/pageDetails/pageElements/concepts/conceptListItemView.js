const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/concepts/conceptListItemView'),

    tagName: 'tr',

    ui: {
        'concept': 'td.concept',
    },

    events: {
        'click @ui.concept': '_onClickConcept',
    },

    initialize: function(options) {
        this.page = options.page;
    },

    _onClickConcept: function(event) {
        event.preventDefault();

        this.page.importElementsFromConcept(this.model);
        App().RootView.modal.hideModal();
    },

});

const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/subroutines/subroutineListItemView'),

    tagName: 'tr',

    ui: {
        'subroutine': 'td.subroutine',
    },

    events: {
        'click @ui.subroutine': '_onClickSubroutine',
    },

    initialize: function(options) {
        this.page = options.page;
    },

    _onClickSubroutine: function(event) {
        event.preventDefault();

        this.page.importElementsFromAbstractElementsCollection(this.model.elements);
        App().RootView.modal.hideModal();
    },

});

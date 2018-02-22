const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementTypePickerView'),

    events: {
        'click nav#new-element-btns a': '_onCreateNewElement',
    },

    initialize: function(options) {
        this.concept = options.concept;
    },

    _onCreateNewElement: function(event) {
        let elementType = $(event.target).attr('data-element-type');
        this.concept.createNewElement(elementType);
        App().RootView.modal.hideModal();
    },

});

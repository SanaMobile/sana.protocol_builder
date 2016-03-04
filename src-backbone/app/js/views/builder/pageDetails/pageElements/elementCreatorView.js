const ConceptSearchModalView = require('./concepts/conceptSearchModalView');


module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementCreatorView'),

    events: {
        // 'click nav#new-element-btns a': '_onCreateNewElement',
        'click a#create-new-element-btn': '_onCreateNewElement',
    },

    _onCreateNewElement: function(event) {
        // let elementType = $(event.target).attr('data-element-type');
        // this.model.createNewElement(elementType);

        App.RootView.modal.show(new ConceptSearchModalView());
    },

});

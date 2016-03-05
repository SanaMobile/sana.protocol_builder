module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementCreatorView'),

    events: {
        'click nav#new-element-btns a': '_onCreateNewElement',
    },

    _onCreateNewElement: function(event) {
        let elementType = $(event.target).attr('data-element-type');
        this.model.createNewElement(elementType);
    },

});

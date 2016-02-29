const Config = require('utils/config');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    childView: require('./elementItemView'),
    childViewContainer: 'ul#elements-list',

    events: {
        'click nav#new-element-btns a': '_onCreateNewElement',
    },

    initialize: function() {
        if (!this.model) {
            return;
        }

        this.collection = this.model.elements;
    },

    _onCreateNewElement: function(event) {
        let elementType = $(event.target).attr('data-element-type');
        this.model.createNewElement(elementType);
    },

});

const Config = require('utils/config');
const ElementsCollectionView = require('views/builder/pageElements/elementsCollectionView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/elementsLayoutView'),

    regions: {
        'elementsList': 'div#elements-list',
    },

    events: {
        'click nav#new-element-btns a': '_onCreateNewElement',
    },

    onRender: function () {
        console.debug('elementsLayoutView render()');

        if (this.model) {
            this.showChildView('elementsList', new ElementsCollectionView({
                collection: this.model.elements,
            }));
        } else {
            this.getRegion('elementsList').reset();
        }
    },

    _onCreateNewElement: function(event) {
        let elementType = $(event.target).attr('data-element-type');
        this.model.createNewElement(elementType);
    },

});

let ElementsCollectionView = require('views/builder/pageElements/elementsCollectionView');
let Section = require('./sectionLayoutView');


module.exports = Section.extend({

    template: require('templates/builder/pageDetails/elementsLayoutView'),

    regions: {
        'elementsList': 'div#elements-list',
    },

    templateHelpers: {
        elementTypes: Config.ELEMENT_NAMES,
    },

    events: {
        'click ul#new-element-btns li a': '_onCreateNewElement',
    },

    onRender: function () {
        if (!this.model) {
            return;
        }

        this.showChildView('elementsList', new ElementsCollectionView({
            collection: this.model.elements,
        }));
    },

    _onCreateNewElement: function(event) {
        let elementType = $(event.target).attr('data-element-type');
        this.model.createNewElement(elementType);
    },

});

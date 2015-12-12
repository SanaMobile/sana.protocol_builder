let ElementsCollectionView = require('./elements/collection_view');
let Section = require('./section');


module.exports = Section.extend({

    template: require('templates/procedures_builder/page_details/section_elements'),

    regions: {
        'elements_list': 'div#elements-list',
    },

    templateHelpers: {
        element_types: Config.ELEMENT_NAMES,
    },

    events: {
        'click ul#new-element-btns li a': 'create_new_element',
    },

    onRender: function () {
        if (!this.model) {
            return;
        }

        this.showChildView('elements_list', new ElementsCollectionView({
            collection: this.model.elements,
        }));
    },

    create_new_element: function(event) {
        const element_type = $(event.target).attr('data-element-type');
        this.model.create_new_element(element_type);
    },

});

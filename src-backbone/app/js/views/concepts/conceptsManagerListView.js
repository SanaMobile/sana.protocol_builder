
module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'concepts-list',
    childView: require('./conceptsManagerListItemView'),

    childEvents: {
        'concept:delete': '_onDeleteConcept',
        'concept:select': '_onSelectConcept',
    },

    // behaviors: {
    //     SortableBehavior: {
    //         displayIndexAttr: 'display_index',
    //         sortableOptions: {
    //             // See http://api.jqueryui.com/sortable/ for more info
    //             placeholder: 'ui-sortable-placeholder',
    //             forcePlaceholderSize: true,
    //             containment: 'body',
    //             distance: 5,
    //         },
    //     },
    // },

    initialize: function() {
        console.log(this);
        // let self = this;
        // this.render();
    },

    _onDeleteConcept: function(childView) {
        console.log('concept deleted: ' + childView.model.attributes.display_name);
    },

    _onSelectConcept: function(childView) {
        console.log('concept selected: ' + childView.model.attributes.display_name);
        this.collection.setActiveConcept(childView.model);
    },

});

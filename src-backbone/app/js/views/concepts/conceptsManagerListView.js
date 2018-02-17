
module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'pages-list',
    childView: require('./conceptsManagerListItemView'),

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

});

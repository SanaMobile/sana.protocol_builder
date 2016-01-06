let Procedure    = require('models/procedure');
let PageItemView = require('./pageListItemView');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'pages-list',

    childView: PageItemView,

    behaviors: {
        SortableBehavior: {
            displayIndexAttr: 'display_index',
            sortableOptions: {
                // See http://api.jqueryui.com/sortable/ for more info
                placeholder: 'ui-sortable-placeholder',
                forcePlaceholderSize: true,
                containment: 'body',
                distance: 5,
            },
        }
    },

    initialize: function() {
        this.collection.on('sync', this.render);
        this.collection.on('destroy', this.render);
        this.collection.on('error', this.render);
        this.collection.parentProcedure.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, this.render);
    },

    onRender: function() {
        console.log('pageListCollectionView onRender');
    },

});

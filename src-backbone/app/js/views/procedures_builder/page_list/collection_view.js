let Procedure    = require('models/procedure_model');
let PageItemView = require('./item');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'pages-list',

    childView: PageItemView,

    behaviors: {
        SortableCollection: {
            display_index_attr: 'display_index',
            sortable_options: {
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
        this.collection.parent_procedure.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT_KEY, this.render);
    },

    onRender: function() {
        console.log('PageCollection onRender');
    },

});

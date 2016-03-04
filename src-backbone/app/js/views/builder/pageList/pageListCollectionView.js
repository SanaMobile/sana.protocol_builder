const Procedure = require('models/procedure');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'pages-list',
    childView: require('./pageListItemView'),

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
        },
    },

    initialize: function() {
        let self = this;

        this.collection.on('sync', function(collection, response, options) {
            self.render();
        });

        this.collection.parentProcedure.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function() {
            self.render();
        });
    },

});

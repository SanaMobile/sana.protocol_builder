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
        let self = this;

        this.collection.on('sync', function(collection, response, options) {
            console.debug('pageListCollectionView render() due to sync event');
            self.render();
        });

        this.collection.parentProcedure.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function() {
            console.debug('pageListCollectionView render() due to ACTIVE_PAGE_CHANGE_EVENT');
            self.render();
        });
    },

});

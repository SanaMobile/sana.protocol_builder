const Procedure = require('models/procedure');


module.exports = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'pages-list',
    childView: require('./pageListItemView'),

    behaviors: function() {
        let self = this;

        return {
            SortableBehavior: {
                displayIndexAttr: 'display_index',
                sortableOptions: {
                    // See http://api.jqueryui.com/sortable/ for more info
                    placeholder: 'ui-sortable-placeholder',
                    forcePlaceholderSize: true,
                    containment: 'body',
                    distance: 5,
                },
                shouldConfirmBeforeSort: function(page, newIndex) {
                    if (page.showIfs.length > 0) {
                        // Going to first page
                        if (newIndex === 0) {
                            return true;
                        }

                        // TODO check if going above a page with elements that this page depends on
                    }

                    return false;
                },
            }
        };
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

module.exports = Marionette.CollectionView.extend({

    tagName: 'table',

    childView: require('./subroutineListItemView'),

    emptyView: require('./subroutineCollectionEmptyView'),

    initialize: function(options) {
        this.page = options.page;
    },

    childViewOptions: function() {
        return {
            page: this.page,
        };
    },

});

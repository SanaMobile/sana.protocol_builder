module.exports = Marionette.CollectionView.extend({

    tagName: 'table',

    childView: require('./conceptListItemView'),

    initialize: function(options) {
        this.page = options.page;
    },

    childViewOptions: function() {
        return {
            page: this.page,
        };
    },

});

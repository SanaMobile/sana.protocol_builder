module.exports = Marionette.LayoutView.extend({

    template: require('templates/common/modalLayoutView'),

    regions: {
        'body': 'section#modal-body',
    },

    initialize: function(options) {
        this.title = options.title;
        this.bodyView = options.bodyView;
    },

    templateHelpers: function() {
        return {
            title: this.title,
        };
    },

    onBeforeShow: function() {
        this.showChildView('body', this.bodyView);
    },

});

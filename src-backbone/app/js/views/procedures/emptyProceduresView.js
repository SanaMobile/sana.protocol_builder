module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/emptyProceduresView'),
    tagName: 'li',
    className: 'empty-procedures',

    onRender: function() {
        this.$el.hide().fadeIn();
    },

});

module.exports = Marionette.ItemView.extend({

    template: Handlebars.templates.procedures_empty,
    tagName: 'li',
    className: 'empty-procedures',

    onRender: function() {
        this.$el.hide().fadeIn();
    },

});

module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/procedures_empty'),
    tagName: 'li',
    className: 'empty-procedures',

    onRender: function() {
        this.$el.hide().fadeIn();
    },

});

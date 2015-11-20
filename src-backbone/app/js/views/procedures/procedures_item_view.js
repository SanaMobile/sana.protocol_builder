module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/procedures_item'),
    tagName: 'li',
    className: 'procedure',

    events: {
        'click a.download': 'download_procedure',
        'click a.delete': 'delete_procedure',
    },

    delete_procedure: function(event) {
        event.preventDefault();
        this.model.destroy();
    },

    download_procedure: function(event) {
        event.preventDefault();
        // TODO
    },

    onRender: function() {
        this.$el.hide().fadeIn();
    },

    remove: function(){
        this.$el.fadeOut(function() {
            $(this).remove();
        });
    }

});

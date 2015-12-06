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

        // TODO prompt user for confirmation

        var self = this;
        var el = this.$el;

        el.fadeOut(function() {
            self.model.destroy({
                success: function(model, response, options) {
                    console.info('Deleted Procedure', self.model.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete Procedure', self.model.get('id'), response.responseJSON);
                    el.fadeIn();
                    // TODO show error alert
                },
            });
        });
    },

    download_procedure: function(event) {
        event.preventDefault();
        // TODO
    },

    onRender: function() {
        this.$el.hide().fadeIn();
    },

});

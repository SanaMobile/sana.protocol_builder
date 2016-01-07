let Helpers = require('utils/helpers');


module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures_builder/navbar'),

    ui: {
        status_text: 'p.status-text'
    },

    //-------------------------------------------------------------------------
    // File menu
    //-------------------------------------------------------------------------

    events: {
        'click #menu-bar ul.file a.save'  : 'file_save',
        'click #menu-bar ul.file a.delete': 'file_delete',
    },

    file_save: function() {
        this.model.save();
    },

    file_delete: function() {
        // TODO prompt user for confirmation

        let self = this;
        this.model.destroy({
            success: function() {
                console.info('Deleted procedure', self.model.get('id'));
            },
            error: function() {
                console.warn('Failed to delete procedure', self.model.get('id')); // TODO also show error alert
            },
            complete: function() {
                Helpers.goto_default_logged_in();
            },
        });
    },

    //-------------------------------------------------------------------------
    // Model events
    //-------------------------------------------------------------------------

    initialize: function() {
        this.listenTo(this.model, 'request', this.saving); // Whenenever an AJAX call is made
        this.listenTo(this.model, 'sync', this.saved); // After server responds
        this.listenTo(this.model, 'destroy', this.saved); // After server responds
        this.listenTo(this.model, 'error', this.error); // After server responds with error
    },

    saving: function (event) {
        this.ui.status_text.text('Saving...');
    },

    saved: function(event) {
        this.ui.status_text.text('All changes saved to server.');
    },

    error: function(event) {
        this.ui.status_text.text('Failed to save to server. Please try again.');
    },

});

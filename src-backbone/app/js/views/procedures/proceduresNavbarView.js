module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/proceduresNavbarView'),

    templateHelpers: function() {
        let self = this;

        return {
            username: function() {
                // TODO fetch from server
                return 'Trinovantes';
            }
        };
    },

});

module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/proceduresNavbarView'),

    tagName: 'div',

    className: 'container-fluid spb-container',

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

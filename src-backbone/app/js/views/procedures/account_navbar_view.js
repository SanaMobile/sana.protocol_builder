module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/account_navbar'),

    constructor: function(options = {}) {
        this.app = options.app || global.App;
        Marionette.ItemView.prototype.constructor.call(this, options);
    },

    templateHelpers: function() {
        var self = this;

        return {
            username: function() {
                // TODO fetch from server
                return 'Trinovantes';
            }
        };
    },

});

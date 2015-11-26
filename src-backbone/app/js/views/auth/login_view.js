module.exports = Marionette.ItemView.extend({

    template: require('templates/auth/login'),

    constructor: function(options = {}) {
        this.app = options.app;
        Marionette.ItemView.prototype.constructor.call(this, options);
    },

    behaviors: function() {
        var self = this;

        return {
            AuthenticationForm: {
                session_authenticator: function (form_data, server_error_handler, network_error_handler) {
                    self.app.session.login(form_data, server_error_handler, network_error_handler);
                },
            }
        };
    },

    ui: {
        remember_me: 'input#remember-me',
    },

    events: {
        'change @ui.remember_me': 'remember',
    },

    templateHelpers: function() {
        var self = this;

        return {
            remember: function() {
                return self.app.storage.is_persistent;
            }
        };
    },

    remember: function() {
        var remember = this.ui.remember_me.is(':checked');
        if (remember) {
            this.app.storage.change_engine(localStorage, true);
        } else {
            this.app.storage.change_engine(sessionStorage, false);
        }
    },

});

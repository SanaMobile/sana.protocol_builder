module.exports = Marionette.ItemView.extend({

    template: Handlebars.templates.login,

    behaviors: {
        AuthenticationForm: {
            session_authenticator: function (form_data, server_error_handler, network_error_handler) {
                App.session.login(form_data, server_error_handler, network_error_handler);
            },
        }
    },

    ui: {
        remember_me: 'input#remember-me',
    },

    events: {
        'change @ui.remember_me': 'remember',
    },

    templateHelpers: {
        remember: App.storage.is_persistent,
    },

    remember: function() {
        var remember = this.ui.remember_me.is(':checked');
        if (remember) {
            App.storage.change_engine(localStorage, true);
        } else {
            App.storage.change_engine(sessionStorage, false);
        }
    },

});

module.exports = Marionette.ItemView.extend({

    template: Handlebars.templates.signup,

    behaviors: {
        AuthenticationForm: {
            session_authenticator: function (form_data, server_error_handler, network_error_handler) {
                App.session.signup(form_data, server_error_handler, network_error_handler);
            },
        }
    }

});
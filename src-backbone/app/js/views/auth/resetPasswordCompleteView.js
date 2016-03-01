const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

module.exports = Marionette.ItemView.extend({

    initialize: function(reset_token) {
        this.token = reset_token.token;
    },

    template: require('templates/auth/resetPasswordCompleteView'),

    ui: {
        form: 'form',
    },

    events: {
        'submit': 'onSubmit',
    },

    onSubmit: function(event) {
        event.preventDefault();

        let self = this;
        let $form = this.ui.form;

        self.completeReset($form.serializeArray());
    },

    completeReset: function(data) {
        let json = {};
        data.forEach(function(item) {
            if (item.value !== "") {
                json[item.name] = item.value;
            }
        });
        json.reset_token = this.token;

        $.ajax({
            type: 'POST',
            url: '/api/passwords/reset_password_complete',
            data: JSON.stringify(json),
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                Helpers.navigateToDefaultLoggedOut();
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'Password successfully reset!',
                    alertType: 'success',
                });
            },
            error: function(errors) {
                App().RootView.clearNotifications();
                Object.keys(errors.responseJSON).forEach(function(key) {
                    App().RootView.showNotification({
                        title: 'There was a problem',
                        desc: errors.responseJSON[key]
                    });
                });
            }
        });
    },

});
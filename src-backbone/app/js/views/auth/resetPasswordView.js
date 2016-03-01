let App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

module.exports = Marionette.ItemView.extend({
    template: require('templates/auth/resetPasswordView'),

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

        self.resetPassword($form.serializeArray());
    },

    resetPassword: function(data) {
        let json = {};
        data.forEach(function(item) {
            if (item.value !== "") {
                json[item.name] = item.value;
            }
        });

        $.ajax({
            type: 'POST',
            data: JSON.stringify(json),
            url: '/api/passwords/reset_password',
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
                    desc: 'Email to reset password sent!',
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
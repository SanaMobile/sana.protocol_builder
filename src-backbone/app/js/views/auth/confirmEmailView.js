const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

module.exports = Marionette.ItemView.extend({

    initialize: function(confirm_token) {
        this.token = confirm_token.token;
        this.confirmEmailToken();
    },

    template: require('templates/auth/confirmEmailView'),

    confirmEmailToken: function() {
        let self = this;
        $.ajax({
            url: '/auth/confirm_email/' + self.token,
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                self.navigateToAppropriateScreen();
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'Email confirmed!',
                    alertType: 'success',
                });
            },
            error: function(errors) {
                self.navigateToAppropriateScreen();
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'There was a problem',
                    desc: "Your email couldn't be verified"
                });
            }
        });
    },

    navigateToAppropriateScreen: function() {
        if (App().session.isValid()) {
            Helpers.navigateToDefaultLoggedIn();
        } else {
            Helpers.navigateToDefaultLoggedOut();
        }
    }

});

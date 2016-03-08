const App                       = require('utils/sanaAppInstance');
const Helpers                   = require('utils/helpers');
const AuthLayoutView            = require('views/auth/authLayoutView');
const SignupView                = require('views/auth/signupView');
const LoginView                 = require('views/auth/loginView');
const SettingsView              = require('views/auth/settingsView');
const ResetPasswordView         = require('views/auth/resetPasswordView');
const ResetPasswordCompleteView = require('views/auth/resetPasswordCompleteView');
const ConfirmEmailView          = require('views/auth/confirmEmailView');


module.exports = Marionette.Controller.extend({

    routeIndex: function() {
        Helpers.navigateToDefaultLoggedOut();
    },

    routeSettings: function() {
        Helpers.arrivedOnView('Settings');

        let authLayoutView = new AuthLayoutView();
        App().RootView.switchMainView(authLayoutView);
        authLayoutView.showChildView('authFormArea', new SettingsView());
    },

    routeResetPassword: function() {
        if (App().session.isValid()) {
            Helpers.navigateToDefaultLoggedIn();
            return;
        }
        Helpers.arrivedOnView('Reset Password');

        let authLayoutView = new AuthLayoutView();
        App().RootView.switchMainView(authLayoutView);
        authLayoutView.showChildView('authFormArea', new ResetPasswordView());
    },

    routeResetPasswordComplete: function(token) {
        Helpers.arrivedOnView('Reset Password');

        let authLayoutView = new AuthLayoutView();
        App().RootView.switchMainView(authLayoutView);
        authLayoutView.showChildView('authFormArea', new ResetPasswordCompleteView({token: token}));
    },

    routeSignup: function () {
        if (App().session.isValid()) {
            Helpers.navigateToDefaultLoggedIn();
            return;
        }

        Helpers.arrivedOnView('Sign Up');

        let authLayoutView = new AuthLayoutView();
        App().RootView.switchMainView(authLayoutView);
        authLayoutView.showChildView('authFormArea', new SignupView());
    },
  
    routeLogin: function() {
        if (App().session.isValid()) {
            Helpers.navigateToDefaultLoggedIn();
            return;
        }

        Helpers.arrivedOnView('Login');

        let authLayoutView = new AuthLayoutView();
        App().RootView.switchMainView(authLayoutView);
        authLayoutView.showChildView('authFormArea', new LoginView());
    },

    routeLogout: function() {
        Helpers.arrivedOnView('Logout');

        App().session.logout();
    },

    routeConfirmEmail: function(token) {
        Helpers.arrivedOnView('Confirm Email');

        let authLayoutView = new AuthLayoutView();
        App().RootView.switchMainView(authLayoutView);
        authLayoutView.showChildView('authFormArea', new ConfirmEmailView({token: token}));
    },

});

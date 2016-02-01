let App            = require('utils/sanaAppInstance');
let Helpers        = require('utils/helpers');
let AuthLayoutView = require('views/auth/authLayoutView');
let SignupView     = require('views/auth/signupView');
let LoginView      = require('views/auth/loginView');


module.exports = Marionette.Controller.extend({

    routeIndex: function() {
        Helpers.navigateToDefaultLoggedOut();
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

});

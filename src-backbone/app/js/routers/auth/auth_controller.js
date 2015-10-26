var Helpers = require('utils/helpers');

module.exports = Marionette.Controller.extend({

    signup: function () {
        if (App.session.isValid()) {
            Helpers.goto_default_logged_in();
            return;
        }

        console.info('View: Sign Up');

        var AuthLayout = require('views/auth/auth_layout');
        var SignupView = require('views/auth/signup_view');

        var auth_layout = new AuthLayout();
        App.root_view.showChildView('main', auth_layout);
        auth_layout.showChildView('form_area', new SignupView());
    },
  
    login: function() {
        if (App.session.isValid()) {
            Helpers.goto_default_logged_in();
            return;
        }

        console.info('View: Login');

        var AuthLayout = require('views/auth/auth_layout');
        var LoginView = require('views/auth/login_view');

        var auth_layout = new AuthLayout();
        App.root_view.showChildView('main', auth_layout);
        auth_layout.showChildView('form_area', new LoginView());
    },

    logout: function() {
        console.info('View: Logout');
        App.session.logout();
    },

});

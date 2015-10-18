var Helpers = require('utils/helpers');

module.exports = Marionette.Controller.extend({

    signup: function () {
        if (App.session.isValid()) {
            Helpers.goto_default_logged_in();
            return;
        }

        console.info('View: Sign Up');
        var SignupView = require('views/auth/signup_view');
        App.root_view.getRegion('main').show(new SignupView().render());
    },
  
    login: function() {
        if (App.session.isValid()) {
            Helpers.goto_default_logged_in();
            return;
        }

        console.info('View: Login');
        var LoginView = require('views/auth/login_view');
        App.root_view.getRegion('main').show(new LoginView().render());
    },

    logout: function() {
        console.info('View: Logout');
        App.session.logout();
    },

});

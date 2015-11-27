module.exports = Marionette.Controller.extend({

    constructor : function (options = {}) {
        this.app        = options.app;
        this.Helpers    = options.Helpers    || require('utils/helpers');
        this.AuthLayout = options.AuthLayout || require('views/auth/auth_layout');
        this.SignupView = options.SignupView || require('views/auth/signup_view');
        this.LoginView  = options.LoginView  || require('views/auth/login_view');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    index: function() {
        this.Helpers.goto_default_logged_out();
    },

    signup: function () {
        if (this.app.session.isValid()) {
            this.Helpers.goto_default_logged_in();
            return;
        }

        this.Helpers.arrived_on_page('Sign Up');

        var auth_layout = new this.AuthLayout({ app: this.app });
        this.app.root_view.showChildView('main', auth_layout);
        auth_layout.showChildView('auth_form_area', new this.SignupView({ app: this.app }));
    },
  
    login: function() {
        if (this.app.session.isValid()) {
            this.Helpers.goto_default_logged_in();
            return;
        }

        this.Helpers.arrived_on_page('Login');

        var auth_layout = new this.AuthLayout({ app: this.app });
        this.app.root_view.showChildView('main', auth_layout);
        auth_layout.showChildView('auth_form_area', new this.LoginView({ app: this.app }));
    },

    logout: function() {
        this.Helpers.arrived_on_page('Logout');

        this.app.session.logout();
    },

});

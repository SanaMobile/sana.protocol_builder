module.exports = Marionette.Controller.extend({

    constructor : function (options) {
        this.app = options.app;
        this.Helpers = (options && options.Helpers) || require('utils/helpers');
        this.AuthLayout = (options && options.AuthLayout) || require('views/auth/auth_layout');
        this.SignupView = (options && options.SignupView) || require('views/auth/signup_view');
        this.LoginView = (options && options.LoginView) || require('views/auth/login_view');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    signup: function () {
        if (this.app.session.isValid()) {
            this.Helpers.goto_default_logged_in();
            return;
        }

        log.info('View: Sign Up');

        var auth_layout = new this.AuthLayout({ app: this.app });
        this.app.root_view.showChildView('main', auth_layout);
        auth_layout.showChildView('form_area', new this.SignupView({ app: this.app }));
    },
  
    login: function() {
        if (this.app.session.isValid()) {
            this.Helpers.goto_default_logged_in();
            return;
        }

        log.info('View: Login');

        var auth_layout = new this.AuthLayout({ app: this.app });
        this.app.root_view.showChildView('main', auth_layout);
        auth_layout.showChildView('form_area', new this.LoginView({ app: this.app }));
    },

    logout: function() {
        log.info('View: Logout');
        this.app.session.logout();
    },

});

let AuthController = require('controllers/authController');


module.exports = Marionette.AppRouter.extend({
  
    constructor : function (options) {
        this.controller = new AuthController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        ''                     : 'routeIndex',
        'login'                : 'routeLogin',
        'logout'               : 'routeLogout',
        'signup'               : 'routeSignup',
        'account'              : 'routeSettings',
        'resetpassword'        : 'routeResetPassword',
        'resetpassword/:token' : 'routeResetPasswordComplete',
        'confirm_email/:token' : 'routeConfirmEmail',
    }

});

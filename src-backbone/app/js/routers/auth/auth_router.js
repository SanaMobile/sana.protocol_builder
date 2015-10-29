var AuthController = require('./auth_controller');


module.exports = Marionette.AppRouter.extend({
  
    constructor : function (options) {
        this.controller = new AuthController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'login': 'login',
        'logout': 'logout',
        'signup': 'signup',
    }

});

var AuthController = require('./auth_controller');
var controller = new AuthController();

module.exports = Marionette.AppRouter.extend({
  
    controller: controller,

    appRoutes: {
        'login': 'login',
        'logout': 'logout',
        'signup': 'signup',
    }

});

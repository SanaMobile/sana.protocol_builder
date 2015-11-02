var InfoController = require('./info_controller');


module.exports = Marionette.AppRouter.extend({
  
    constructor : function (options) {
        this.controller = new InfoController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'terms': 'terms_of_service',
        'privacy': 'privacy_policy',
    }

});

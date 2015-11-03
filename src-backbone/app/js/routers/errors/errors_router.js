var ErrorsController = require('./errors_controller');


module.exports = Marionette.AppRouter.extend({

    constructor : function (options) {
        this.controller = new ErrorsController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        '404': 'not_found',
    }

});

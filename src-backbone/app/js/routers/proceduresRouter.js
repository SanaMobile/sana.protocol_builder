let ProceduresController = require('controllers/proceduresController');


module.exports = Marionette.AppRouter.extend({

    constructor : function (options) {
        this.controller = new ProceduresController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'procedures'                  : 'routeProcedures',
        'procedures/:id'              : 'routeBuilder',
        'procedures/:id/page/:pageId' : 'routeBuilder',
    }

});

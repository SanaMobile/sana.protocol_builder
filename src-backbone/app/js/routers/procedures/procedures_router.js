var ProceduresController = require('./procedures_controller');


module.exports = Marionette.AppRouter.extend({

    constructor : function (options) {
        this.controller = new ProceduresController(options);
        Marionette.AppRouter.prototype.constructor.call(this, options);
    },

    appRoutes: {
        'procedures'     : 'procedures',
        'procedures/:id' : 'procedure_builder',
    }

});

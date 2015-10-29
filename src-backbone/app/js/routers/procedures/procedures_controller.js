module.exports = Marionette.Controller.extend({

    constructor : function (options) {
        this.app = options.app;
        Marionette.Controller.prototype.constructor.call(this, options);
    },

    procedures: function () {
        log.info('View: Procedures');
        var ProceduresView = require('views/procedures/procedures_view');
        this.app.root_view.getRegion('main').show(new ProceduresView().render());
    },

});

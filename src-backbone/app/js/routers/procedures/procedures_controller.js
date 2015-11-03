module.exports = Marionette.Controller.extend({

    constructor : function (options) {
        this.app = options.app;
        this.Helpers                  = (options && options.Helpers)                  || require('utils/helpers');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    procedures: function () {
        this.Helpers.arrived_on_page('Procedures');

        var ProceduresView = require('views/procedures/procedures_view');
        this.app.root_view.getRegion('main').show(new ProceduresView().render());
    },

});

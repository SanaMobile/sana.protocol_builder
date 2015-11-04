module.exports = Marionette.Controller.extend({

    constructor : function (options) {
        this.app = options.app;
        this.ProceduresLayout = (options && options.ProceduresLayout) || require('views/procedures/procedures_layout');
        this.Helpers          = (options && options.Helpers)          || require('utils/helpers');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    procedures: function () {
        this.Helpers.arrived_on_page('Procedures');

        // Setup main layout
        var procedures_layout = new this.ProceduresLayout({
            app: this.app
        });
        procedures_layout.render();
        this.app.root_view.getRegion('main').show(procedures_layout);
    },

});

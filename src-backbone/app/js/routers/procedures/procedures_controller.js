module.exports = Marionette.Controller.extend({

    procedures: function () {
        console.info('View: Procedures');
        var ProceduresView = require('views/procedures/procedures_view');
        App.root_view.getRegion('main').show(new ProceduresView().render());
    },

});

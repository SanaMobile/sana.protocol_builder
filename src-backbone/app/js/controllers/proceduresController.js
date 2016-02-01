const Config = require('utils/config');

let App              = require('utils/sanaAppInstance');
let Helpers          = require('utils/helpers');
let Procedure        = require('models/procedure');
let ProceduresLayout = require('views/procedures/proceduresLayoutView');
let BuilderLayout    = require('views/builder/builderLayoutView');


module.exports = Marionette.Controller.extend({

    routeProcedures: function () {
        Helpers.arrivedOnView('Procedures');
        App().RootView.clearNotifications(); // Clear login errors
        App().RootView.switchMainView(new ProceduresLayout(), 'procedures');
    },

    routeBuilder: function(procedureId, pageId) {
        if (Config.DEBUG) {
            Helpers.arrivedOnView('Builder procedure:' + procedureId + ' page:' + pageId);
        } else {
            Helpers.arrivedOnView('Builder');
        }

        App().RootView.clearNotifications(); // Clear login errors
        App().RootView.switchMainView(new BuilderLayout({ procedureId: procedureId, pageId: pageId }), 'builder');
    },

});

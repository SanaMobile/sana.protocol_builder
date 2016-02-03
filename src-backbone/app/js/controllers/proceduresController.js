let App              = require('utils/sanaAppInstance');
let Helpers          = require('utils/helpers');
let Procedure        = require('models/procedure');
let ProceduresLayout = require('views/procedures/proceduresLayoutView');
let BuilderLayout    = require('views/builder/builderLayoutView');


module.exports = Marionette.Controller.extend({

    routeProcedures: function () {
        Helpers.arrivedOnView('Procedures');
        App().clearNotifications(); // Clear login errors
        App().switchMainView(new ProceduresLayout(), 'procedures');
    },

    routeBuilder: function(procedureId, pageId) {
        if (DEBUG) {
            Helpers.arrivedOnView('Builder procedure:' + procedureId + ' page:' + pageId);
        } else {
            Helpers.arrivedOnView('Builder');
        }

        App().clearNotifications(); // Clear login errors

        let procedure = new Procedure({ 
            // model attributes
            id: procedureId,
        }, {
            // options passed to constructor
            loadDetails: true,
            activePageId: pageId,
        });

        procedure.fetch({
            success: function() {
                console.info('Fetched Procedure', procedureId);
                App().switchMainView(new BuilderLayout({ model: procedure }), 'builder');
            },
            error: function() {
                console.warn('Failed to fetch Procedure', procedureId);
                App().showNotification('danger', 'Failed to fetch Procedure!');
                App().switchMainView(new BuilderLayout({ model: procedure }), 'builder');
            },
        });
    },

});

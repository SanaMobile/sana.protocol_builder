let App              = require('sanaAppInstance');
let Helpers          = require('utils/helpers');
let Procedure        = require('models/procedure');
let ProceduresLayout = require('views/procedures/proceduresLayoutView');
let BuilderLayout    = require('views/builder/builderLayoutView');


module.exports = Marionette.Controller.extend({

    routeProcedures: function () {
        Helpers.arrivedOnView('Procedures');
        App().switchView(new ProceduresLayout());
    },

    routeBuilder: function(procedureId, pageId) {
        if (DEBUG) {
            Helpers.arrivedOnView('Builder procedure:' + procedureId + ' page:' + pageId);
        } else {
            Helpers.arrivedOnView('Builder');
        }

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
                App().switchView(new BuilderLayout({ model: procedure }), 'builder');
            },
            error: function() {
                console.warn('Failed to fetch Procedure', procedureId);
                // TODO maybe present error alert?
            },
        });
    },

});

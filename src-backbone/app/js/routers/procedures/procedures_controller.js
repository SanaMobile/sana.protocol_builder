module.exports = Marionette.Controller.extend({

    constructor : function (options = {}) {
        this.app              = options.app;
        this.Procedure        = options.Procedure        || require('models/procedure_model');
        this.ProceduresLayout = options.ProceduresLayout || require('views/procedures/procedures_layout');
        this.BuilderLayout    = options.BuilderLayout    || require('views/procedures_builder/main_layout');
        this.Helpers          = options.Helpers          || require('utils/helpers');

        Marionette.Controller.prototype.constructor.call(this, options);
    },

    procedures: function () {
        this.Helpers.arrived_on_page('Procedures');

        var procedures_layout = new this.ProceduresLayout({
            app: this.app
        });
        this.app.root_view.show_view(procedures_layout);
    },

    procedures_builder: function(procedure_id, page_id) {
        this.Helpers.arrived_on_page('Builder');
        if (DEBUG) {
            this.Helpers.arrived_on_page('procedure:' + procedure_id + ' page:' + page_id);
        }

        var procedure = new this.Procedure({ 
            id: procedure_id,
        }, {
            load_details: true,
            active_page_id: page_id,
        });

        var self = this;
        procedure.fetch({
            success: function() {
                console.info('Fetched Procedure', procedure_id);
                self.app.root_view.show_view(new self.BuilderLayout({ model: procedure }), 'builder');
            },
            error: function() {
                console.warn('Failed to fetch Procedure', procedure_id);
                // TODO maybe present error alert?
            },
        });
    },

});

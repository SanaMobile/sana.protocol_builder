var RootView = require('views/root_view');

var AuthenticationForm = require('behaviors/authentication_form');

var AuthRouter = require('routers/auth/auth_router');
var ProceduresRouter = require('routers/procedures/procedures_router');

var SessionModel = require('models/session.js');
var Helpers = require('utils/helpers');
var Storage = require('utils/storage');

module.exports = Marionette.Application.extend({

    initialize: function() {
        // When Backbone.sync hits an 401, then it means the user token is 
        // no longer valid and they need to relog in
        var sync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            options.error = function(xhr, ajaxOptions, thrownError) {
                if (xhr.status === 401) {
                    // Reloads the page (i.e. resets the App state)
                    // TODO views should check URL onStart to see if there's a server message and display an alert
                    window.location = '/?error=invalid_token';
                }
            };
            sync(method, model, options);
        };

        // Assign root view for modules to render in
        this.root_view = new RootView();

        // Load behaviours
        var self = this;
        Marionette.Behaviors.behaviorsLookup = function() {
            return self.Behaviors;
        };
        this.Behaviors = {};
        this.Behaviors.AuthenticationForm = AuthenticationForm;

        // Load modules
        this.auth_router = new AuthRouter();
        this.procedure_router = new ProceduresRouter();

        // Setup storage mechanism
        this.storage = new Storage();

        // Setup authentication
        // After logging in/out, the Session model will trigger the change:auth_token event
        var active_session = new SessionModel();
        active_session.on('change:' + SessionModel.AUTH_TOKEN_KEY, function() {
            var has_token = active_session.has(SessionModel.AUTH_TOKEN_KEY);
            console.info('Auth Token Changed: ' + has_token);

            if (has_token) {
                Helpers.goto_default_logged_in();
            } else {
                Helpers.goto_default_logged_out();
            }
        });
        this.session = active_session;
    },

    onStart: function () {
        this.session.fetch(); // Load any existing tokens
        Backbone.history.start({ pushState: true });

        // Do this after Backbone.history has started so the navigate will work
        if (!this.session.isValid()) {
            console.info("Started with invalid session");
            this.session.logout();
            if (Helpers.current_page_require_authentication()) {
                Helpers.goto_default_logged_out();
            }
        }
    },

});

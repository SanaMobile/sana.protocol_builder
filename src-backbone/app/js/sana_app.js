var RootView = require('views/root_view');

var AuthenticationForm = require('behaviors/auth_form_behavior');

var AuthRouter = require('routers/auth/auth_router');
var ProceduresRouter = require('routers/procedures/procedures_router');

var SessionModel = require('models/session.js');
var Config = require('utils/config');
var Helpers = require('utils/helpers');
var Storage = require('utils/storage');


module.exports = Marionette.Application.extend({

    init: function() {
        this._setup_authentication();
        this._setup_views();
        this._load_behaviors();
        this._load_routers();
    },

    onStart: function () {
        // Load any existing tokens
        // Do this before Backbone.history has started so that the model change
        // events don't redirect the user yet
        this.session.fetch();

        Backbone.history.start({ pushState: true });

        // Do this after Backbone.history has started so the navigate will work
        if (!this.session.isValid()) {
            log.info("Started with invalid session");
            this.session.destroy();
            if (Helpers.current_page_require_authentication()) {
                Helpers.goto_default_logged_out();
            }
        }
    },

    _setup_authentication: function() {
        var self = this;

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

        // Setup storage mechanism
        this.storage = new Storage();

        // Setup session
        // After logging in/out, the Session model will trigger the change:auth_token event
        this.session = new SessionModel({ storage: this.storage });
        this.session.on('change:' + SessionModel.AUTH_TOKEN_KEY, function() {
            var has_token = self.session.has(SessionModel.AUTH_TOKEN_KEY);
            log.info('Auth Token Changed: ' + has_token);

            if (has_token) {
                Helpers.goto_default_logged_in();
            } else {
                Helpers.goto_default_logged_out();
            }
        });

        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            options.url = Config.API_BASE + options.url;
            if (self.session.has(SessionModel.AUTH_TOKEN_KEY)) {
                jqXHR.setRequestHeader('Authorization', 'Token ' + self.session.get(SessionModel.AUTH_TOKEN_KEY));
            }
        });
    },

    _setup_views: function() {
        // Assign root view for modules to render in
        this.root_view = new RootView();
    },

    _load_behaviors: function() {
        var self = this;

        // Load behaviours
        Marionette.Behaviors.behaviorsLookup = function() {
            return self.Behaviors;
        };
        this.Behaviors = {};
        this.Behaviors.AuthenticationForm = AuthenticationForm;
    },

    _load_routers: function() {
        this.auth_router = new AuthRouter({ app: this });
        this.procedure_router = new ProceduresRouter({ app: this });
    },

});

let RootLayoutView = require('views/rootLayoutView');

let AuthFormBehavior = require('behaviors/authFormBehavior');
let SortableBehavior = require('behaviors/sortableBehavior');

let AuthRouter = require('routers/authRouter');
let InfoRouter = require('routers/infoRouter');
let ProceduresRouter = require('routers/proceduresRouter');

let Session = require('models/session');
let Helpers = require('utils/helpers');
let Storage = require('utils/storage');


module.exports = Marionette.Application.extend({

    init: function() {
        this._setupSession();
        this._setupBackboneSync();
        this._setupAjaxPrefilters();
        this._setupViews();
        this._setupHistory();

        this._loadBehaviors();
        this._loadRouters();
    },

    onStart: function () {
        Backbone.history.start({ pushState: true });

        // Do this after Backbone.history has started so the navigate will work
        if (!this.session.isValid()) {
            console.info("Started with invalid session");
            this.session.destroy();
            if (Helpers.currentPageRequiresAuth()) {
                Helpers.navigateToDefaultLoggedOut();
            }
        }
    },

    switchMainView: function(view, bodyClass = null) {
        if (DEBUG) {
            global.activeView = view;
        }

        this._rootView.showChildView('main', view);
        this._rootView.$el.removeClass().addClass(bodyClass);
    },

    switchNavbar: function(navbarView) {
        this._rootView.showChildView('navbar', navbarView);
    },

    clearNotifications: function() {
        this._rootView.clearNotifications();
    },

    showNotification: function(alertType, title, desc, timeout) {
        this._rootView.showNotification(alertType, title, desc, timeout);
    },

    _setupSession: function() {
        let self = this;

        // Setup storage mechanism
        this.storage = new Storage();

        // Setup session
        // After logging in/out, the Session model will trigger the change:AUTH_TOKEN_KEY event
        this.session = new Session({ storage: this.storage });
        this.session.on('change:' + Session.AUTH_TOKEN_KEY, function() {
            let hasToken = self.session.has(Session.AUTH_TOKEN_KEY);
            console.info('Auth Token Changed: ' + hasToken);

            if (hasToken) {
                Helpers.navigateToDefaultLoggedIn();
            } else {
                Helpers.navigateToDefaultLoggedOut();
            }
        });

        // Load any existing tokens
        // Do this before Backbone.history has started so that the model change
        // events don't redirect the user yet
        this.session.fetch();
    },

    _setupBackboneSync: function() {
        let self = this;

        // When Backbone.sync hits an 401, then it means the user token is 
        // no longer valid and they need to relog in
        let originalSync = Backbone.sync;
        Backbone.sync = function(method, model, options) {
            let originalErrorHandler = options.error;
            options.error = function(xhr, ajaxOptions, thrownError) {
                switch (xhr.status) {
                    case 401: {
                        // Reloads the page (i.e. resets the App state)
                        console.warn('Backbone.sync encountered 401. Resetting user session.');
                        self.showNotification('danger', 'Your session is invalid!', 'Please login again.');
                        self.session.destroy();
                        break;
                    }
                    default: {
                        console.warn('Cannot globally handle Backbone.sync error');
                        originalErrorHandler(xhr, ajaxOptions, thrownError);
                    }
                }
            };
            originalSync(method, model, options);
        };
    },

    _setupAjaxPrefilters: function() {
        let self = this;

        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            options.url = Config.API_BASE + options.url;

            if (self.session.has(Session.AUTH_TOKEN_KEY)) {
                jqXHR.setRequestHeader('Authorization', 'Token ' + self.session.get(Session.AUTH_TOKEN_KEY));
            }
        });
    },

    _setupViews: function() {
        let self = this;

        // Assign root view for modules to render in
        this._rootView = new RootLayoutView();
        this._rootView.render();

        this.session.on('request', function() {
            self._rootView.showSpinner();
        });
        this.session.on('complete', function() {
            self._rootView.hideSpinner();
        });
    },

    _setupHistory: function() {
        const ROUTE_NOT_FOUND_EVENT = 'route-not-found';
        let self = this;

        let History = Backbone.History.extend({
            loadUrl: function() {
                let match = Backbone.History.prototype.loadUrl.apply(this, arguments);
                if (!match) {
                    this.trigger(ROUTE_NOT_FOUND_EVENT);
                }
                return match;
            }
        });

        Backbone.history = new History();
        Backbone.history.on(ROUTE_NOT_FOUND_EVENT, function() {
            self.routers.infoRouter.controller.routeError404NotFound();
        });
    },

    _loadBehaviors: function() {
        let self = this;

        Marionette.Behaviors.behaviorsLookup = function() {
            return self.Behaviors;
        };
        this.Behaviors = {};
        this.Behaviors.AuthFormBehavior = AuthFormBehavior;
        this.Behaviors.SortableBehavior = SortableBehavior;
    },

    _loadRouters: function() {
        this.routers = {};
        this.routers.authRouter = new AuthRouter();
        this.routers.infoRouter = new InfoRouter();
        this.routers.proceduresRouter = new ProceduresRouter();
    },

});

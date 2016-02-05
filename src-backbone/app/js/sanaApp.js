let RootLayoutView = require('views/rootLayoutView');

let AuthFormBehavior = require('behaviors/authFormBehavior');
let ChoiceBasedElementBehavior = require('behaviors/choiceBasedElementBehavior');
let RightNavbarBehavior = require('behaviors/rightNavbarBehavior');
let SortableBehavior = require('behaviors/sortableBehavior');

let AuthRouter = require('routers/authRouter');
let InfoRouter = require('routers/infoRouter');
let ProceduresRouter = require('routers/proceduresRouter');

let Session = require('models/session');
let Helpers = require('utils/helpers');
let Config = require('utils/config');
let Storage = require('utils/storage');


module.exports = Marionette.Application.extend({

    init: function() {
        this._setupSession();
        this._setupBackboneSync();
        this._setupAjaxPrefilters();
        this._setupViews();

        this._loadBehaviors();
        this._loadRouters();
    },

    onStart: function () {
        let lang = this._getCurrentValidLangOrRedirectToDefaultLang();
        if (typeof lang === 'undefined') {
            // Currently redirecting...
            return;
        }

        let self = this;
        i18n.changeLanguage(lang, function() {
            let foundRoute = Backbone.history.start({
                pushState: true,
                root: '/' + lang + '/',
            });

            if (foundRoute) {
                // Do this after Backbone.history has started so the navigate will work
                if (!self.session.isValid()) {
                    console.info("Started with invalid session");
                    self.session.destroy();
                    if (Helpers.currentPageRequiresAuth()) {
                        Helpers.navigateToDefaultLoggedOut();
                    }
                }
            } else {
                self.routers.infoRouter.controller.routeError404NotFound();
            }
        });
    },

    changeLanguage: function(newLang) {
        let urlPath = Backbone.history.location.pathname;
        let oldLang = this._getCurrentValidLangOrRedirectToDefaultLang();

        if (oldLang === newLang) {
            console.warn('Trying to change to the same language');
            return;
        }

        let newPath = '/' + newLang + '/' + urlPath.substr(('/' + oldLang + '/').length);
        window.location.pathname = newPath;
    },

    _getCurrentValidLangOrRedirectToDefaultLang: function() {
        let redirect = function(lang, pathname = '') {
            // pathname should not have leading '/'
            window.location.pathname = '/' + lang + '/' + pathname;
        };
        let localeToLang = function(locale) {
            return locale.split('-')[0];
        };

        // Normalize path such that there's no leading slash
        let urlPath = Backbone.history.location.pathname;
        urlPath = (urlPath.charAt(0) === '/') ? urlPath.substr(1) : urlPath;
        let pathParts = urlPath.split('/');

        if (pathParts.length === 1 && pathParts[0].length === 0) {
            // Index with no language
            redirect(localeToLang(Config.DEFAULT_LOCALE));
        } else {
            // There might be a valid language in URL
            let lang = pathParts[0];
            let locales = Config.LOCALES_SUPPORTED.map(l => l.code).map(localeToLang);
            if (locales.includes(lang)) {
                return lang;
            }

            // Don't support the lang in url
            redirect(localeToLang(Config.DEFAULT_LOCALE), urlPath);
        }
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
                        self.RootView.showNotification({
                            title: 'Your session is invalid!', 
                            desc: 'Please login again.',
                        });
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
        // Overwrite marionette renderer to add global Config data
        const originalRenderer = Marionette.Renderer.render;
        Marionette.Renderer.render = function(template, data) {
            const mergeToData = function(value, key) {
                if (!_.has(data, key)) {
                    data[key] = value;
                }
            };

            const miscData = {
                currentLanguage: i18n.language,
            };

            // Merge in global Config
            _.each(Config, mergeToData);
            _.each(miscData, mergeToData);

            return originalRenderer(template, data);
        };

        // Assign root view for modules to render in
        this.RootView = new RootLayoutView();
        this.RootView.render();
    },

    _loadBehaviors: function() {
        let self = this;

        Marionette.Behaviors.behaviorsLookup = function() {
            return self.Behaviors;
        };
        this.Behaviors = {};
        this.Behaviors.AuthFormBehavior = AuthFormBehavior;
        this.Behaviors.RightNavbarBehavior = RightNavbarBehavior;
        this.Behaviors.ChoiceBasedElementBehavior = ChoiceBasedElementBehavior;
        this.Behaviors.SortableBehavior = SortableBehavior;
    },

    _loadRouters: function() {
        this.routers = {};
        this.routers.authRouter = new AuthRouter();
        this.routers.infoRouter = new InfoRouter();
        this.routers.proceduresRouter = new ProceduresRouter();
    },

});

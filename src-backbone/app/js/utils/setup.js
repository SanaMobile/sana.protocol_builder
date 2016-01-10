let Config = require('./config');
let Helpers = require('./helpers');


module.exports = {

    loadConfig: function() {
        global.Config = Config;
        global.DEBUG = Config.DEBUG;
    },

    loadLibs: function() {
        // Loads libraries into global namespace
        global.$ = global.jQuery = require('jquery');
        require('jquery-ui/sortable');

        global._ = require('underscore');
        global.Backbone = require('backbone');
        global.Backbone.$ = $;
        global.Marionette = require('backbone.marionette');

        global.Handlebars = require("hbsfy/runtime");
        this._loadHandlebarsHelpers();
        this._setupI18N();
        global.HandlebarsIntl = require('handlebars-intl');
        HandlebarsIntl.registerWith(Handlebars);

        require('bootstrap');
    },

    _loadHandlebarsHelpers: function() {
        Handlebars.registerHelper('sluggify', Helpers.sluggify);

        Handlebars.registerHelper('readableElementName', function(str) {
            return Config.ELEMENT_NAMES[str];
        });
    },

    _setupI18N: function() {
        let isLocalesSupported = require('intl-locales-supported');

        if (global.Intl) {
            // Determine if the built-in `Intl` has the locale data we need.
            if (!isLocalesSupported(Config.LOCALES_SUPPORTED)) {
                // `Intl` exists, but it doesn't have the data we need, so load the
                // polyfill and replace the constructors with need with the polyfill's.
                require('intl');
                Intl.NumberFormat   = IntlPolyfill.NumberFormat;
                Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
            }
        } else {
            // No `Intl`, so use and load the polyfill.
            global.Intl = require('intl');
        }
    },

};

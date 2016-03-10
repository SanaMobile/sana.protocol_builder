const Config = require('./config');
const Helpers = require('./helpers');


module.exports = {

    loadLibs: function() {
        // Loads libraries into global namespace
        global.$ = global.jQuery = require('jquery');
        global.moment = require('moment');
        require('jquery-ui/sortable');
        require('bootstrap');
        require('bootstrap-datepicker');
        require('bootstrap-select');

        global._ = require('underscore');
        global.Backbone = require('backbone');
        global.Backbone.$ = $;
        global.Marionette = require('backbone.marionette');

        global.Handlebars = require("hbsfy/runtime");
        this._loadHandlebarsHelpers();
        this._setupFormatJS(); // For formatting/translating dates, numbers, currency
        this._setupI18Next(); // For translating strings
    },

    _loadHandlebarsHelpers: function() {
        Handlebars.registerHelper('sluggify', Helpers.sluggify);

        Handlebars.registerHelper('checkSelected', function(value, activeValue) {
            if (value === activeValue) {
                return ' selected ';
            }
        });

        Handlebars.registerHelper('checkChecked', function(value, activeValue) {
            if (value == activeValue) {
                return ' checked ';
            }
        });

        Handlebars.registerHelper('breaklines', function(text) {
            text = Handlebars.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new Handlebars.SafeString(text);
        });
    },

    _setupFormatJS: function() {
        if (global.Intl) {
            // Determine if the built-in `Intl` has the locale data we need.
            let isLocalesSupported = require('intl-locales-supported');
            if (!isLocalesSupported(Config.LOCALES_SUPPORTED.map(l => l.code))) {
                // `Intl` exists, but it doesn't have the data we need, so load the
                // polyfill and replace the constructors with need with the polyfill's.
                require('intl');
                Intl.NumberFormat   = IntlPolyfill.NumberFormat;
                Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
            }
        } else {
            // No `Intl`, so use and load the polyfill.
            global.Intl = require('intl');
            require('intl/locale-data/jsonp/en.js');
        }

        global.HandlebarsIntl = require('handlebars-intl');
        HandlebarsIntl.registerWith(Handlebars);
    },

    _setupI18Next: function() {
        global.i18n = require('i18next');
        global.MissingWords = {};
        const Backend = require('i18next-xhr-backend');

        i18n.use(Backend);

        // This only sets the options, need to call init() to actually load the language files
        i18n.options = {
            debug: Config.DEBUG,
            fallbackLng: 'en',
            nsSeparator: ':::',
            keySeparator: '###',
            backend: {
                loadPath: '/locales/{{lng}}/{{ns}}.json',
                parse: function(data) {
                    return JSON.parse(data.replace(/\/\/.*/g, '')); // Remove comments from JSON
                },
            },
            saveMissing: Config.DEBUG,
            missingKeyHandler: function(language, namespace, key, fallbackValue) {
                MissingWords[key] = fallbackValue;
            },
        };

        Handlebars.registerHelper('i18n', function(key, options) {
            let result = i18n.t(key, options.hash);
            return new Handlebars.SafeString(result);
        });
    },

};

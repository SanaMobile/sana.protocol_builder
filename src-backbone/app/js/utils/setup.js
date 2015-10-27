module.exports = {

    load_libs: function() {
        // Loads libraries into global namespace
        global.$ = global.jQuery = require('jquery');
        global._ = require('underscore');
        global.Handlebars = require('handlebars');
        global.Backbone = require('backbone');
        global.Backbone.$ = $;
        global.Marionette = require('backbone.marionette');
    }

};

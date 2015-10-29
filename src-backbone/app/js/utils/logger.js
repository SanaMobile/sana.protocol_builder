var colors = require('colors');


module.exports = function(is_debug) {
    return {
        error: function(message) {
            if (!is_debug) return;
            console.error('%c' + colors.red(message), 'color:Red');
        },

        warn: function(message) {
            if (!is_debug) return;
            console.warn('%c' + colors.yellow(message), 'color:OrangeRed');
        },

        info: function (message) {
            if (!is_debug) return;
            console.info('%c' + colors.green(message), 'color:Green');
        },

        log: function (message) {
            if (!is_debug) return;
            console.log('%c' + colors.blue(message), 'color:Blue');
        },

        debug: function (message) {
            if (!is_debug) return;
            console.debug('%c' + colors.grey(message), 'color:#999');
        },
    };
};

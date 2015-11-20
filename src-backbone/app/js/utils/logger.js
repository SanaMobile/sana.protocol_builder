var colors = require('colors');


module.exports = function(is_enabled) {
    return {
        error: function(message) {
            if (!is_enabled) {
                return;
            }

            if (_.isString(message)) {
                console.error('%c' + colors.red(message), 'color:Red');
            } else {
                console.error(message);
            }
        },

        warn: function(message) {
            if (!is_enabled) {
                return;
            }

            if (_.isString(message)) {
                console.warn('%c' + colors.yellow(message), 'color:OrangeRed');
            } else {
                console.warn(message);
            }
        },

        info: function (message) {
            if (!is_enabled) {
                return;
            }

            if (_.isString(message)) {
                console.info('%c' + colors.green(message), 'color:Green');
            } else {
                console.info(message);
            }
        },

        log: function (message) {
            if (!is_enabled) {
                return;
            }

            if (_.isString(message)) {
                console.log('%c' + colors.blue(message), 'color:Blue');
            } else {
                console.log(message);
            }
        },

        debug: function (message) {
            if (!is_enabled) {
                return;
            }

            if (_.isString(message)) {
                console.debug('%c' + colors.grey(message), 'color:#999');
            } else {
                console.debug(message);
            }
        },
    };
};

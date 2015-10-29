var Config = require('utils/config');
var prefix = Config.APP_NAMESPACE + '_';


module.exports = function() {

    this.backend = localStorage;
    this.is_persistent = true;

    // Check if we have something stored in sessionStorage
    // If so, then we were using sessionStorage since last page refresh
    for (var i = sessionStorage.length - 1; i >= 0; i--) {
        var key = sessionStorage.key(i);
        if (key.substr(0, Config.APP_NAMESPACE.length) === Config.APP_NAMESPACE) {
            this.backend = sessionStorage;
            this.is_persistent = false;
            break;
        }
    }

    this.read = function (key) {
        return JSON.parse(this.backend.getItem(prefix + key));
    };

    this.write = function(key, obj) {
        this.backend.setItem(prefix + key, JSON.stringify(obj));
    };

    this.delete = function(key) {
        this.backend.removeItem(prefix + key);
    };

    this.change_engine = function(new_backend, is_persistent) {
        var old_backend = this.backend;

        for (var i = old_backend.length - 1; i >= 0; i--) {
            var key = old_backend.key(i);

            if (key.substr(0, Config.APP_NAMESPACE.length) === Config.APP_NAMESPACE) {
                var value = old_backend.getItem(key);
                old_backend.removeItem(key);
                new_backend.setItem(key, value);
            }
        }

        this.backend = new_backend;
        this.is_persistent = is_persistent;
    };

};

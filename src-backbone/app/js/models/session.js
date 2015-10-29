var AUTH_TOKEN_KEY = 'auth_token';
var STORAGE_KEY = AUTH_TOKEN_KEY;


var SessionModel = Backbone.Model.extend({

    constructor : function (options) {
        this.storage = options && options.storage;
        Backbone.Model.prototype.constructor.call(this, options);
    },

    url: function() {
        throw("Session should never use the built-in url() method. All default behaviour that interacts with the server should be overwritten.");
    },

    fetch: function() {
        this.set(this.storage.read(STORAGE_KEY));
    },

    save: function(attributes) {
        this.storage.write(STORAGE_KEY, this.toJSON());
    },

    destroy: function(options) {
        this.clear();
        this.storage.delete(STORAGE_KEY);
    },

    validate: function() {
        // Check if auth token exists
        if (!this.has(AUTH_TOKEN_KEY)) {
            return 'No auth token in session model.';
        }
    },

    signup: function(form_data, server_error_handler, network_error_handler) {
        this.logout();

        var self = this;
        $.ajax({
            data: form_data,
            type: 'POST',
            url: '/auth/signup',
            success: function(response) {
                self._auth_handler(response, server_error_handler);
            },
            error: function(error) {
                network_error_handler(error);
            },
        });
    },

    login: function(form_data, server_error_handler, network_error_handler) {
        this.logout();

        var self = this;
        $.ajax({
            data: form_data,
            type: 'POST',
            url: '/auth/login',
            success: function(response) {
                self._auth_handler(response, server_error_handler);
            },
            error: function(error) {
                network_error_handler(error);
            },
        });
    },

    logout: function() {
        this.destroy();
    },

    _auth_handler: function(response, server_error_handler) {
        if (response.success) {
            this.set(AUTH_TOKEN_KEY, response.token);
            this.save();
        } else {
            if (_.isFunction(server_error_handler)) {
                server_error_handler(response.errors);
            }
        }
    },

});

SessionModel.AUTH_TOKEN_KEY = AUTH_TOKEN_KEY;

module.exports = SessionModel;

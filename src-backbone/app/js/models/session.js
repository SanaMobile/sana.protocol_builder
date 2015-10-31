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

        // Check if auth token is still valid
        if (!this._check_token(this.get(AUTH_TOKEN_KEY))) {
            return 'Invalid auth token';
        }
    },

    signup: function(form_data, server_error_handler, network_error_handler) {
        this.destroy();

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
        this.destroy();

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
        var self = this;
        $.ajax({
            type: 'POST',
            url: '/auth/logout',
            beforeSend: function(jqXHR, settings) {
                self.trigger('request');
            },
            complete: function(jqXHR, textStatus) {
                self.trigger('complete');
                self.destroy();
            },
        });
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

    _check_token: function(token) {
        // TODO ping server to see if token is valid
        return true;
    },

});

SessionModel.AUTH_TOKEN_KEY = AUTH_TOKEN_KEY;

module.exports = SessionModel;

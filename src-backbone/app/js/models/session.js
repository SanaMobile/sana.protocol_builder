var AUTH_TOKEN_KEY = 'auth_token';
var STORAGE_KEY = AUTH_TOKEN_KEY;

var Config = require('utils/config');
var Helpers = require('utils/helpers');

var SessionModel = Backbone.Model.extend({

    initialize: function() {
        var self = this;
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            options.url = Config.API_BASE + options.url;
            if (self.has(AUTH_TOKEN_KEY)) {
                jqXHR.setRequestHeader('Authorization', 'Token ' + self.get(AUTH_TOKEN_KEY));
            }
        });
    },

    url: function() {
        console.error("Session should never use the built-in url() method. All default behaviour that interacts with the server should be overwritten.");
        return null;
    },

    fetch: function() {
        this.set(App.storage.read(STORAGE_KEY));
    },

    save: function(attributes) {
        App.storage.write(STORAGE_KEY, this.toJSON());
    },

    destroy: function(options) {
        this.clear();
        App.storage.delete(STORAGE_KEY);
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

    _check_token: function(token) {
        // TODO ping server to see if token is valid
        return true;
    },

});

SessionModel.AUTH_TOKEN_KEY = AUTH_TOKEN_KEY;

module.exports = SessionModel;

const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
const STORAGE_KEY = AUTH_TOKEN_KEY;


let SessionModel = Backbone.Model.extend({

    constructor : function (options = {}) {
        this.storage = options.storage;
        Backbone.Model.prototype.constructor.call(this, options);
    },

    url: function() {
        throw new ReferenceError("Session should never use the built-in url() method. All default behaviour that interacts with the server should be overwritten.");
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

    signup: function(formData, serverErrorHandler, networkErrorHandler) {
        this.destroy();

        let self = this;
        $.ajax({
            data: formData,
            type: 'POST',
            url: '/auth/signup',
            beforeSend: function(jqXHR, settings) {
                self.trigger('request');
            },
            success: function(response) {
                self._authHandler(response, serverErrorHandler);
            },
            error: function(error) {
                networkErrorHandler(error);
            },
            complete: function(jqXHR, textStatus) {
                self.trigger('complete');
            },
        });
    },

    login: function(formData, serverErrorHandler, networkErrorHandler) {
        this.destroy();

        let self = this;
        $.ajax({
            data: formData,
            type: 'POST',
            url: '/auth/login',
            beforeSend: function(jqXHR, settings) {
                self.trigger('request');
            },
            success: function(response) {
                self._authHandler(response, serverErrorHandler);
            },
            error: function(error) {
                networkErrorHandler(error);
            },
            complete: function(jqXHR, textStatus) {
                self.trigger('complete');
            },
        });
    },

    logout: function() {
        let self = this;
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

    _authHandler: function(response, serverErrorHandler) {
        if (response.success) {
            this.set(AUTH_TOKEN_KEY, response.token);
            this.save();
        } else {
            if (_.isFunction(serverErrorHandler)) {
                serverErrorHandler(response.errors);
            }
        }
    },

});

SessionModel.AUTH_TOKEN_KEY = AUTH_TOKEN_KEY;

module.exports = SessionModel;

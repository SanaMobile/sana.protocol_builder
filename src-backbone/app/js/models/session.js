const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

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
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                self._authHandler(response, serverErrorHandler);
            },
            error: function(error) {
                networkErrorHandler(error);
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
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                self._authHandler(response, serverErrorHandler);
            },
            error: function(error) {
                networkErrorHandler(error);
            },
        });
    },

    logout: function() {
        let self = this;
        $.ajax({
            type: 'POST',
            url: '/auth/logout',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
                self.destroy();
            },
        });
    },

    updateInformation: function(formData) {
        let self = this;
        let json = {};
        formData.forEach(function(item) {
            if (item.value !== "") {
                json[item.name] = item.value;
            }
        });
        json.auth = self.get(AUTH_TOKEN_KEY);
        $.ajax({
            type: 'PATCH',
            data: JSON.stringify(json),
            url: '/api/users/update_details',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'Successfuly updated account details!',
                    alertType: 'success',
                });
            },
            error: function(errors) {
                App().RootView.clearNotifications();
                let parsedErrors = JSON.parse(errors.responseText)
                Object.keys(parsedErrors).forEach(function(key) {
                    App().RootView.showNotification({
                        title: 'There was a problem',
                        desc: parsedErrors[key]
                    });
                });
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

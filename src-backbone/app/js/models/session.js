const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');
const User = require('models/user');

const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
const USER_STORAGE_KEY = 'USER_DATA';
const STORAGE_KEY = AUTH_TOKEN_KEY;


let SessionModel = Backbone.Model.extend({

    constructor : function (attributes, options) {
        this.storage = attributes.storage;
        delete attributes.storage;

        Backbone.Model.prototype.constructor.call(this, attributes, options);
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

    isPriveleged: function() {
        return this.has(USER_STORAGE_KEY) && this.get(USER_STORAGE_KEY).is_superuser;
    },

    refreshUser: function(async = true) {
        let user = new User(this.get(USER_STORAGE_KEY));
        let self = this;
        user.fetch({
            async: async,
            success: function(model) {
                self.set(USER_STORAGE_KEY, model);
                self.save();
            },
        });
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
                this.set(USER_STORAGE_KEY, response.user);
                this.save();
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'Successfuly updated account details!',
                    alertType: 'success',
                });
            },
            error: function(errors) {
                App().RootView.clearNotifications();
                let parsedErrors = JSON.parse(errors.responseText);
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
            this.set(USER_STORAGE_KEY, response.user);
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
SessionModel.USER_STORAGE_KEY = USER_STORAGE_KEY;

module.exports = SessionModel;

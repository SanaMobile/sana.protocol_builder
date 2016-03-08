const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');
const User = require('models/user');

const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';
const USER_STORAGE_KEY = 'USER_KEY';
const STORAGE_KEY = AUTH_TOKEN_KEY;


let SessionModel = Backbone.Model.extend({

    constructor : function (attributes, options) {
        this.storage = attributes.storage;
        delete attributes.storage;

        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    initialize: function() {
        this.user = new User({});
    },

    updateSessionUser: function(userData) {
        let defaults = _.pick(userData, _.keys(this.user.defaults));
        this.user.set(defaults);
        this.set(USER_STORAGE_KEY, defaults);
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
        this.storage.delete(USER_STORAGE_KEY);
    },

    validate: function() {
        // Check if auth token exists
        if (!this.has(AUTH_TOKEN_KEY)) {
            return 'No auth token in session model.';
        }
    },

    setAuthToken: function(data) {
        data.auth = this.get(AUTH_TOKEN_KEY);
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
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'An email has been sent to your provided email address. Please follow the link to verify your email.',
                    alertType: 'success',
                });
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

    _authHandler: function(response, serverErrorHandler) {
        if (response.success) {
            this.updateSessionUser(response.user);
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

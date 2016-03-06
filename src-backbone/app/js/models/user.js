const App = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

module.exports = Backbone.Model.extend({

    urlRoot: '/api/users',

    defaults: {
        id: 0,
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        is_superuser: false,
    },

    constructor: function(attributes, options) {
        Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    isPriveleged: function() {
        return this.get('is_superuser');
    },

    updateInformation: function(formData) {
        let self = this;
        let json = {};
        formData.forEach(function(item) {
            if (item.value !== "") {
                json[item.name] = item.value;
            }
        });

        App().session.setAuthToken(json);
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
                self.set(response.user);
                Helpers.navigateToDefaultLoggedIn();
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'Successfuly updated account details!',
                    alertType: 'success',
                });
            },
            error: self._errorHandler,
        });
    },

    _errorHandler: function(errors) {
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

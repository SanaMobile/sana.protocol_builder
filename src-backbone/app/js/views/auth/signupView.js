let App = require('sanaAppInstance');


module.exports = Marionette.ItemView.extend({

    template: require('templates/auth/signupView'),

    behaviors: {
        AuthFormBehavior: {
            sessionAuthenticator: function (formData, serverErrorHandler, networkErrorHandler) {
                App().session.signup(formData, serverErrorHandler, networkErrorHandler);
            },
        }
    },

});

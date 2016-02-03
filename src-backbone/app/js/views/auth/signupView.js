let App = require('utils/sanaAppInstance');


module.exports = Marionette.ItemView.extend({

    template: require('templates/auth/signupView'),

    behaviors: {
        AuthFormBehavior: {
            onAuthenticate: function (formData, serverErrorHandler, networkErrorHandler) {
                App().session.signup(formData, serverErrorHandler, networkErrorHandler);
            },
        }
    },

});

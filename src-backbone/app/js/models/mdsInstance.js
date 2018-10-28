const App = require('utils/sanaAppInstance');

const SUCCESS_MDS_STATUS_CODES = [200, 401, 404];


module.exports = Backbone.Model.extend({

    urlRoot: '/api/mdsInstance',

    parse: function(response, options) {
        // Returns collection of length 1, since we are supporting a single MDS
        // instance per user right now.
        return response[0];
    },

    attemptLogin: function(
        apiUrl,
        username,
        password,
        successCallback,
        errorCallback
    ) {
        let self = this;
        const formData = {
            api_url: apiUrl,
            username: username,
            password: password,
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(formData),
            url: '/api/mdsInstance/attempt_login',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                const mdsStatusCode = response.mds_status_code;
                if (SUCCESS_MDS_STATUS_CODES.indexOf(mdsStatusCode) >= 0) {
                    if (response.mds_instance) {
                        self.set(response.mds_instance);
                    }
                    successCallback(mdsStatusCode);
                } else {
                    errorCallback();
                }
            },
            error: errorCallback,
        });
    },

    pushToMDS: function(procedureId, successCallback, errorCallback) {
        const formData = {
            procedure_id: procedureId,
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(formData),
            url: '/api/mdsInstance/push_to_mds',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function(response) {
                const mdsStatusCode = response.mds_status_code;
                if (SUCCESS_MDS_STATUS_CODES.indexOf(mdsStatusCode) >= 0) {
                    successCallback(mdsStatusCode);
                } else {
                    errorCallback();
                }
            },
            error: errorCallback,
        });
    }
});

const App = require('utils/sanaAppInstance');
const ElementModalLayoutView = require('views/common/elementModalLayoutView');
const PushToMDSModalView = require('views/push/pushToMDSModalView');
const MDSInstance = require('models/mdsInstance');


module.exports = {

    pushToMDS: function(procedureId) {
        const self = this;

        // Fetch mds instance:
        const mdsInstance = new MDSInstance({});
        mdsInstance.fetch({
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function() {
                console.info('Fetched MDS info.');
                if (!mdsInstance.get('api_url')) {
                    self.showInputModal(
                        mdsInstance,
                        procedureId,
                        {
                            headingText: i18n.t('This account has no MDS instance. You can add one below.'),
                        }
                    );
                } else {
                    self.pushProcedure(mdsInstance, procedureId);
                }
            },
            error: function() {
                console.error('Failed to fetch MDS info.');
                App().RootView.showNotification('Failed to fetch MDS info.');
            },
        });
    },

    showInputModal: function(mdsInstance, procedureId, options) {
        options.onSubmit = this.attemptLoginToMds.bind(
            this,
            mdsInstance,
            procedureId
        );
        const pushModal = new ElementModalLayoutView({
            title: i18n.t('Push to Mobile'),
            bodyView: new PushToMDSModalView(options),
        });
        App().RootView.showModal(pushModal);
    },

    attemptLoginToMds: function(
        mdsInstance,
        procedureId,
        url,
        username,
        password
    ) {
        const self = this;

        mdsInstance.attemptLogin(
            url,
            username,
            password,
            function (mdsStatusCode) {
                switch (mdsStatusCode) {
                    case 200:
                        console.info('Successfully logged into MDS.');
                        self.pushProcedure(mdsInstance, procedureId);
                        break;
                    case 401:
                        console.error('Failed to login to MDS because auth failed.');
                        self.showInputModal(
                            mdsInstance,
                            procedureId,
                            {
                                headingText: i18n.t('Authentication failed for the provided username and password.'),
                                url,
                                username,
                                password,
                            }
                        );
                        break;
                    case 404:
                        console.error('Failed to login to MDS because endpoint was not found.');
                        self.showInputModal(
                            mdsInstance,
                            procedureId,
                            {
                                headingText: i18n.t('The provided MDS URL was not found.'),
                                url,
                                username,
                                password,
                            }
                        );
                        break;
                }
            },
            function (error) {
                console.error('Failed to login to MDS.');
                App().RootView.showNotification('Failed to login to MDS.');
                App().RootView.hideModal();
            }
        );
    },

    pushProcedure: function(mdsInstance, procedureId) {
        const self = this;

        mdsInstance.pushToMDS(
            procedureId,
            function (mdsStatusCode) {
                switch (mdsStatusCode) {
                    case 200:
                        console.info('Successfully pushed procedure.');
                        App().RootView.showNotification('Successfully pushed procedure.');
                        App().RootView.hideModal();
                        break;
                    case 401:
                        console.error('Failed to push procedure because MDS auth failed.');
                        self.showInputModal(
                            mdsInstance,
                            procedureId,
                            {
                                headingText: i18n.t('Your MDS session has expired. Please login again.'),
                                url: mdsInstance.get('api_url'),
                            }
                        );
                        break;
                    case 404:
                        console.error('Failed to push procedure to because MDS endpoint not found.');
                        self.showInputModal(
                            mdsInstance,
                            procedureId,
                            {
                                headingText: i18n.t('The provided MDS URL was not found.'),
                                url: mdsInstance.get('api_url'),
                            }
                        );
                        break;
                }
            },
            function (error) {
                console.error('Failed to push procedure.');
                App().RootView.showNotification('Failed to push procedure.');
                App().RootView.hideModal();
            }
        );
    },
};

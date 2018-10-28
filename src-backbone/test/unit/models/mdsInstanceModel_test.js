require('setup/hooks');

describe('MDS Model', function() {
    let server;
    let mdsInstance;
    let showSpinnerStub;
    let hideSpinnerStub;
    let successCallback;
    let errorCallback;

    const MDS_SUCCESS_CODES = [200, 401, 404];
    const SAMPLE_MDS_FAILURE_CODE = 400;

    beforeEach(function() {
        server = sinon.fakeServer.create();

        showSpinnerStub = sinon.stub();
        hideSpinnerStub = sinon.stub();

        successCallback = sinon.stub();
        errorCallback = sinon.stub();

        const MDSInstance = proxyquire('models/mdsInstance', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                    },
                };
            },
        });

        mdsInstance = new MDSInstance();
    });

    afterEach(function() {
        server.restore();
    });

    describe('test attemptLogin', function() {
        const MDS_API_URL = 'https://www.yourMdsUrl.com';
        const MDS_API_KEY = 'test_mds_api_key';
        const MDS_USERNAME = 'test_mds_username';
        const MDS_PASSWORD = 'test_mds_password';

        const callAttemptLogin = function(mdsStatusCode) {
            server.respondWith([
                200,
                {"Content-Type": "application/json"},
                JSON.stringify({
                    mds_status_code: mdsStatusCode,
                    mds_instance: {
                        api_url: MDS_API_URL,
                        api_key: MDS_API_KEY,
                    },
                }),
            ]);

            mdsInstance.attemptLogin(
                MDS_API_URL,
                MDS_USERNAME,
                MDS_PASSWORD,
                successCallback,
                errorCallback
            );

            assert.equal(
                server.requests[0].requestBody,
                JSON.stringify({
                    api_url: MDS_API_URL,
                    username: MDS_USERNAME,
                    password: MDS_PASSWORD,
                })
            );

            assert(showSpinnerStub.calledOnce);
            server.respond();
            assert(hideSpinnerStub.calledOnce);

            return mdsInstance;
        };

        MDS_SUCCESS_CODES.forEach(function(successCode) {
            it('success response', function() {
                const mdsInstance = callAttemptLogin(successCode);

                assert(successCallback.calledOnce);
                assert(successCallback.calledWith(successCode));
                assert(errorCallback.notCalled);

                assert.equal(mdsInstance.get('api_url'), MDS_API_URL);
                assert.equal(mdsInstance.get('api_key'), MDS_API_KEY);
            });
        });

        it('failure response', function() {
            callAttemptLogin(SAMPLE_MDS_FAILURE_CODE);

            assert(successCallback.notCalled);
            assert(errorCallback.calledOnce);
        });
    });

    describe('test pushToMDS', function() {
        const PROCEDURE_ID = 1;

        const callPushToMDS = function(mdsStatusCode) {
            server.respondWith([
                200,
                {"Content-Type": "application/json"},
                JSON.stringify({mds_status_code: mdsStatusCode}),
            ]);

            mdsInstance.pushToMDS(
                PROCEDURE_ID,
                successCallback,
                errorCallback
            );

            assert.equal(
                server.requests[0].requestBody,
                JSON.stringify({
                    procedure_id: PROCEDURE_ID,
                })
            );

            assert(showSpinnerStub.calledOnce);
            server.respond();
            assert(hideSpinnerStub.calledOnce);
        };

        MDS_SUCCESS_CODES.forEach(function(successCode) {
            it('success response', function() {
                callPushToMDS(successCode);

                assert(successCallback.calledOnce);
                assert(successCallback.calledWith(successCode));
                assert(errorCallback.notCalled);
            });
        });

        it('failure response', function() {
            callPushToMDS(SAMPLE_MDS_FAILURE_CODE);

            assert(successCallback.notCalled);
            assert(errorCallback.calledOnce);
        });
    });
});

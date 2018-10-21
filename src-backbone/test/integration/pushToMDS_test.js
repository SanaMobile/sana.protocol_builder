require('setup/hooks');

describe('MDS Push', function() {
    let server;
    let showSpinnerStub;
    let hideSpinnerStub;
    let showNotificationStub;
    let hideModalStub;
    let showInputModalStub;
    let PushToMDSUtils;
    let MDSInstance;

    const PROCEDURE_ID = 1;
    const MDS_API_URL = 'https://www.yourMdsUrl.com';
    const MDS_API_KEY = 'test_mds_api_key';
    const MDS_USERNAME = 'test_mds_username';
    const MDS_PASSWORD = 'test_mds_password';

    beforeEach(function() {
        server = sinon.fakeServer.create();

        showSpinnerStub = sinon.stub();
        hideSpinnerStub = sinon.stub();
        showNotificationStub = sinon.stub();
        hideModalStub = sinon.stub();

        MDSInstance = proxyquire('models/mdsInstance', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                    },
                };
            },
        });
        PushToMDSUtils = proxyquire('utils/pushToMDSUtils', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                        showNotification: showNotificationStub,
                        hideModal: hideModalStub,
                    },
                };
            },
            'views/common/elementModalLayoutView': {
                'templates/common/elementModalLayoutView' : {},
            },
            'views/push/pushToMDSModalView': {
                'templates/common/modalLayoutView' : {},
            },
            'models/mdsInstance': MDSInstance,
        });
        showInputModalStub = sinon.stub(PushToMDSUtils, 'showInputModal');
    });

    afterEach(function() {
        server.restore();
    });

    describe('test push', function() {
        describe('push with MDS already set', function() {
            const push = function(mdsStatusCode) {
                PushToMDSUtils.pushToMDS(PROCEDURE_ID);

                assert(showSpinnerStub.calledOnce);
                server.respondWith([
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify([{
                        api_url: MDS_API_URL,
                        api_key: MDS_API_KEY,
                    }]),
                ]);
                server.respond();
                assert(hideSpinnerStub.calledOnce);

                assert(showSpinnerStub.calledTwice);
                assert.equal(
                    server.requests[1].requestBody,
                    JSON.stringify({
                        procedure_id: PROCEDURE_ID,
                    })
                );
                server.respondWith([
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify({mds_status_code: mdsStatusCode}),
                ]);
                server.respond();
                assert(hideSpinnerStub.calledTwice);
            };

            it('test 200 mds push response', function() {
                push(200);

                assert(showNotificationStub.calledOnce);
                assert(showNotificationStub.calledWith('Successfully pushed procedure.'));
                assert(showInputModalStub.notCalled);
                assert(hideModalStub.calledOnce);
            });

            it('test 401 mds push response', function() {
                push(401);

                assert(showInputModalStub.calledOnce);
                assert(hideModalStub.notCalled);
            });

            it('test 404 mds push response', function() {
                push(404);

                assert(showInputModalStub.calledOnce);
                assert(hideModalStub.notCalled);
            });
        });

        describe('push with MDS not set', function() {
            it('test showInputModal called', function() {
                PushToMDSUtils.pushToMDS(PROCEDURE_ID);

                assert(showSpinnerStub.calledOnce);
                server.respondWith([
                    200,
                    {"Content-Type": "application/json"},
                    JSON.stringify([{
                        api_url: null,
                        api_key: null,
                    }]),
                ]);
                server.respond();
                assert(hideSpinnerStub.calledOnce);

                assert(showInputModalStub.calledOnce);
                assert(hideModalStub.notCalled);
            });
        });
    });

    describe('test login', function() {
        const attemptLogin = function(mdsStatusCode) {
            const mdsInstance = new MDSInstance({
                api_url: MDS_API_URL,
                api_key: MDS_API_KEY,
            });
            PushToMDSUtils.attemptLoginToMds(
                mdsInstance,
                PROCEDURE_ID,
                MDS_API_URL,
                MDS_USERNAME,
                MDS_PASSWORD
            );

            assert(showSpinnerStub.calledOnce);
            assert.equal(
                server.requests[0].requestBody,
                JSON.stringify({
                    api_url: MDS_API_URL,
                    username: MDS_USERNAME,
                    password: MDS_PASSWORD,
                })
            );
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
            server.respond();
            assert(hideSpinnerStub.calledOnce);
        };

        it('test 200 mds login response', function() {
            attemptLogin(200);

            assert(showSpinnerStub.calledTwice);
            assert.equal(
                server.requests[1].requestBody,
                JSON.stringify({
                    procedure_id: PROCEDURE_ID,
                })
            );
            server.respondWith([
                200,
                {"Content-Type": "application/json"},
                JSON.stringify({mds_status_code: 200}),
            ]);
            server.respond();
            assert(hideSpinnerStub.calledTwice);

            assert(showNotificationStub.calledOnce);
            assert(showNotificationStub.calledWith('Successfully pushed procedure.'));
            assert(showInputModalStub.notCalled);
            assert(hideModalStub.calledOnce);
        });

        it('test 401 mds login response', function() {
            attemptLogin(401);

            assert(showInputModalStub.calledOnce);
            assert(hideModalStub.notCalled);
        });

        it('test 404 mds login response', function() {
            attemptLogin(404);

            assert(showInputModalStub.calledOnce);
            assert(hideModalStub.notCalled);
        });
    });
});

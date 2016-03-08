require('setup/hooks');

const TOKEN = 'fake_token';

describe("Session Model", function() {
    let session;
    let storage;

    let showSpinnerStub;
    let hideSpinnerStub;

    let clearNotificationsStub;
    let showNotificationStub;

    beforeEach(function() {
        showSpinnerStub = sinon.stub();
        hideSpinnerStub = sinon.stub();

        clearNotificationsStub = sinon.stub();
        showNotificationStub = sinon.stub();

        const Storage = require('utils/storage');
        const Session = proxyquire('models/session', {
            'utils/sanaAppInstance': function() {
                return {
                    RootView: {
                        showSpinner: showSpinnerStub,
                        hideSpinner: hideSpinnerStub,
                        clearNotifications: clearNotificationsStub,
                        showNotification: showNotificationStub,
                    },
                };
            },
        });

        storage = new Storage();
        session = new Session({ storage: storage });
    });

    afterEach(function() {
        session.clear();
    });

    describe("#constructor()", function() {
        it("should have a storage engine", function() {
            assert.isObject(session.storage);
            assert.strictEqual(session.storage, storage);
        });
    });

    describe("Default Backbone.Model Behaviour", function() {
        let storageMock;

        beforeEach(function() {
            storageMock = sinon.mock(session.storage);
        });

        afterEach(function() {
            storageMock.verify();
        });

        describe("#url()", function() {
            it("should throw an error", function() {
                assert.throws(session.url, ReferenceError);
            });
        });

        describe("#fetch()", function() {
            it("should read from storage", function() {
                storageMock.expects('read').once();
                session.fetch();
            });

            it("should trigger change event", function() {
                let Session = require('models/session');
                let storageStub = sinon.stub(session.storage, 'read', function() {
                    let data = {};
                    data[Session.AUTH_TOKEN_KEY] = TOKEN;
                    return data;
                });

                let eventSpy = sinon.spy();
                session.on('change:' + Session.AUTH_TOKEN_KEY, eventSpy);

                session.fetch(); // Will read from storageStub and should trigger a change event

                assert(eventSpy.calledOnce);
            });
        });

        describe("#save()", function() {
            it("should write to storage", function() {
                storageMock.expects('write').once();
                session.save();
            });
        });

        describe("#destroy()", function() {
            it("should delete from storage", function() {
                storageMock.expects('delete').twice();
                session.destroy();
            });

            it("should trigger change event", function() {
                const Session = require('models/session');
                session.set(Session.AUTH_TOKEN_KEY, TOKEN);

                let eventSpy = sinon.spy();
                session.on('change:' + Session.AUTH_TOKEN_KEY, eventSpy);

                session.destroy();

                assert(eventSpy.calledOnce);
            });

            it("should not have any data left afterwards", function() {
                session.set('test_key', 'test_data');

                session.destroy();

                assert.isFalse(session.has('test_key'));
            });
        });

        describe("#validate()", function() {
            // validate() returns nothing if it was successful
            // otherwise returns something to represent the error

            it("should fail if there is no token", function() {
                const Session = require('models/session');
                session.unset(Session.AUTH_TOKEN_KEY);
                assert.isDefined(session.validate());
            });

            it("should succeed if there is a token", function() {
                const Session = require('models/session');
                session.set(Session.AUTH_TOKEN_KEY, TOKEN);
                assert.isUndefined(session.validate());
            });
        });
    });

    describe("Authentication Methods", function() {
        let server;

        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        describe("#signup()", function() {
            it("should send an AJAX request", function(){
                session.signup();
                assert.lengthOf(server.requests, 1);
            });

            it("should call _authHandler on success", function(){
                server.respondWith([200, {}, '']);

                let authHandlerSpy = sinon.spy(session, '_authHandler');
                session.signup();
                server.respond();

                assert(authHandlerSpy.calledOnce);
                assert(showSpinnerStub.calledOnce);
                assert(hideSpinnerStub.calledOnce);
            });

            it("should call networkErrorHandler on error", function(){
                server.respondWith([404, {}, '']);

                let serverErrorHandler = sinon.spy();
                let networkErrorHandler = sinon.spy();
                session.signup(null, serverErrorHandler, networkErrorHandler);
                server.respond();

                assert(serverErrorHandler.notCalled);
                assert(networkErrorHandler.calledOnce);
                assert(showSpinnerStub.calledOnce);
                assert(hideSpinnerStub.calledOnce);
            });
        });

        describe("#login()", function() {
            it("should send an AJAX request", function(){
                session.login();
                assert.lengthOf(server.requests, 1);
            });

            it("should call _authHandler on success", function(){
                server.respondWith([200, {}, '']);

                let authHandlerSpy = sinon.spy(session, '_authHandler');
                session.login();
                server.respond();

                assert(authHandlerSpy.calledOnce);
                assert(showSpinnerStub.calledOnce);
                assert(hideSpinnerStub.calledOnce);
            });

            it("should call networkErrorHandler on error", function(){
                server.respondWith([404, {}, '']);

                let serverErrorHandler = sinon.spy();
                let networkErrorHandler = sinon.spy();
                session.login(null, serverErrorHandler, networkErrorHandler);
                server.respond();

                assert(serverErrorHandler.notCalled);
                assert(networkErrorHandler.calledOnce);
                assert(showSpinnerStub.calledOnce);
                assert(hideSpinnerStub.calledOnce);
            });
        });

        describe("#logout()", function() {
            it("should send an AJAX request", function(){
                session.logout();
                assert.lengthOf(server.requests, 1);
            });

            it("should not call destroy() immediately", function(){
                let sessionDestroySpy = sinon.spy(session, 'destroy');
                session.logout();
                assert(sessionDestroySpy.notCalled);
            });

            it("should call destroy() after server returns success", function(){
                let sessionDestroySpy = sinon.spy(session, 'destroy');

                session.logout();
                server.respondWith([200, {}, '']);
                server.respond();

                assert(sessionDestroySpy.calledOnce);
                assert(showSpinnerStub.calledOnce);
                assert(hideSpinnerStub.calledOnce);
            });

            it("should call destroy() after server returns error", function(){
                let sessionDestroySpy = sinon.spy(session, 'destroy');

                session.logout();
                server.respondWith([401, {}, '']);
                server.respond();

                assert(sessionDestroySpy.calledOnce);
                assert(showSpinnerStub.calledOnce);
                assert(hideSpinnerStub.calledOnce);
            });
        });
    });

    describe("#_authHandler()", function() {
        it("should save token if request was successful on the backend", function() {
            const Session = require('models/session');

            let sessionSaveSpy = sinon.spy(session, 'save');
            let serverErrorHandler = sinon.spy();
            let response = {
                success: true,
                token: TOKEN,
            };

            session._authHandler(response, serverErrorHandler);

            assert.strictEqual(session.get(Session.AUTH_TOKEN_KEY), TOKEN);
            assert(sessionSaveSpy.calledOnce);
            assert(serverErrorHandler.notCalled);
        });

        it("should call serverErrorHandler if request was unsuccessful on the backend", function() {
            const Session = require('models/session');
            const ERROR_MESSAGE = 'error';

            let sessionSaveSpy = sinon.spy(session, 'save');
            let serverErrorHandler = sinon.spy();
            let response = {
                success: false,
                token: TOKEN,
                errors: ERROR_MESSAGE,
            };

            session._authHandler(response, serverErrorHandler);

            assert.isUndefined(session.get(Session.AUTH_TOKEN_KEY));
            assert(sessionSaveSpy.notCalled);
            assert(serverErrorHandler.calledOnce);
            assert(serverErrorHandler.calledWith(ERROR_MESSAGE));
        });
    });

});

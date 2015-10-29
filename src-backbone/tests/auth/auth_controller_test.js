var CreateSuite = require('utils/create_suite');
var AuthController = require('routers/auth/auth_controller');
var SessionModel = require('models/session');
var RootView = require('views/root_view');


CreateSuite("Auth Controller", function() {
    var app;
    var auth_controller;

    var root_view_stub;
    var auth_layout_spy;
    var auth_layout_stub;
    var signup_view_stub;
    var login_view_stub;

    var helpers_mock;

    beforeEach(function() {
        app = {
            session: new SessionModel(),
            root_view: new RootView(),
        };

        root_view_stub = sinon.stub(app.root_view, 'showChildView');
        auth_layout_spy = sinon.spy();
        auth_layout_stub = sinon.stub().returns({ showChildView: auth_layout_spy });
        signup_view_stub = sinon.stub();
        login_view_stub = sinon.stub();

        auth_controller = new AuthController({
            app: app,
            AuthLayout: auth_layout_stub,
            SignupView: signup_view_stub,
            LoginView: login_view_stub,
        });

        helpers_mock = sinon.mock(auth_controller.Helpers);
    });

    afterEach(function() {
        helpers_mock.verify();
    });

    describe("#signup()", function() {
        it("should redirect if user is already logged in", function() {
            var session_stub = sinon.stub(app.session, 'isValid', function() {
                return true;
            });

            helpers_mock.expects('goto_default_logged_in').once();

            auth_controller.signup();

            sinon.assert.notCalled(auth_layout_stub);
            sinon.assert.notCalled(signup_view_stub);
            sinon.assert.notCalled(root_view_stub);
        });
        it("should render in root view if not logged in", function() {
            var session_stub = sinon.stub(app.session, 'isValid', function() {
                return false;
            });

            helpers_mock.expects('goto_default_logged_in').never();

            auth_controller.signup();

            assert(auth_layout_stub.calledOnce);
            assert(signup_view_stub.calledOnce);
            sinon.assert.notCalled(login_view_stub);
            assert(root_view_stub.calledOnce);
        });
    });

    describe("#login()", function() {
        it("should redirect if user is already logged in", function() {
            var session_stub = sinon.stub(app.session, 'isValid', function() {
                return true;
            });

            helpers_mock.expects('goto_default_logged_in').once();

            auth_controller.login();

            sinon.assert.notCalled(auth_layout_stub);
            sinon.assert.notCalled(login_view_stub);
            sinon.assert.notCalled(signup_view_stub);
            sinon.assert.notCalled(root_view_stub);
        });
        it("should render in root view if not logged in", function() {
            var session_stub = sinon.stub(app.session, 'isValid', function() {
                return false;
            });

            helpers_mock.expects('goto_default_logged_in').never();

            auth_controller.login();

            assert(auth_layout_stub.calledOnce);
            assert(login_view_stub.calledOnce);
            sinon.assert.notCalled(signup_view_stub);
            assert(root_view_stub.calledOnce);
        });
    });

    describe("#logout()", function() {
        it("should clear session", function() {
            var session_stub = sinon.stub(app.session, 'logout');
            auth_controller.logout();
            assert(session_stub.calledOnce);
        });
    });
});

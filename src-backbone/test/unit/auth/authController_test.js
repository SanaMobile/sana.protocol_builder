require('setup/hooks');

describe('Auth Controller', function() {
    let app;
    let appSwitchViewStub;

    let authController;
    let helpersMock;

    let authLayoutView;
    let authLayoutViewShowChildViewStub;
    let authLayoutViewStub;

    let signupView;
    let signupViewStub;

    let loginView;
    let loginViewStub;

    let settingsView;
    let settingsViewStub;

    beforeEach(function() {
        // Setup helpers
        let helpers = require('utils/helpers');
        helpersMock = sinon.mock(helpers);

        // Setup app
        appSwitchViewStub = sinon.stub();
        let SanaApp = proxyquire('sanaApp', {
            'views/rootLayoutView'         : function() { 
                this.switchMainView = appSwitchViewStub;
                this.render = sinon.stub();
            },
            'behaviors/authFormBehavior': {},
            'behaviors/choiceBasedElementBehavior': {},
            'behaviors/sortableBehavior': {},
            'behaviors/rightNavbarBehavior': {},
            'routers/authRouter': {},
            'routers/infoRouter': {},
            'routers/proceduresRouter': {},
            'utils/helpers': helpers,
        });
        app = new SanaApp();
        app._setupViews();
        let getAppInstance = function() {
            return app;
        };

        // Setup authLayoutView
        authLayoutViewShowChildViewStub = sinon.stub();
        authLayoutView = {
            showChildView: authLayoutViewShowChildViewStub,
        };
        authLayoutViewStub = sinon.stub().returns(authLayoutView);

        // Setup signupView
        signupView = {
            name: 'signupView',
        };
        signupViewStub = sinon.stub().returns(signupView);

        // Setup loginView
        loginView = {
            name: 'loginView',
        };
        loginViewStub = sinon.stub().returns(loginView);

        // Setup settingsView
        settingsView = {
            name: 'settingsView',
        };
        settingsViewStub = sinon.stub().returns(settingsView);

        // Setup authController
        let AuthController = proxyquire('controllers/authController', {
            'utils/sanaAppInstance': getAppInstance,
            'utils/helpers': helpers,
            'views/auth/authLayoutView' : authLayoutViewStub,
            'views/auth/signupView': signupViewStub,
            'views/auth/loginView': loginViewStub,
            'views/auth/settingsView': settingsViewStub,
        });
        authController = new AuthController();
    });

    afterEach(function() {
        helpersMock.verify();
        helpersMock.restore();
    });

    describe('#routeIndex()', function() {
        it('always redirect to logged out page', function() {
            helpersMock.expects('navigateToDefaultLoggedOut').once();
            authController.routeIndex();
        });
    });

    describe('#routeSignup()', function() {
        it('should redirect if user is already logged in', function() {
            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
            let sessionStub = sinon.stub(app.session, 'isValid', function() {
                return true;
            });

            helpersMock.expects('arrivedOnView').never();
            helpersMock.expects('navigateToDefaultLoggedIn').once();
            authController.routeLogin();

            assert(authLayoutViewStub.notCalled);
            assert(signupViewStub.notCalled);
            assert(loginViewStub.notCalled);
        });

        it('should render in root view if user is not logged in', function() {
            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
            let sessionStub = sinon.stub(app.session, 'isValid', function() {
                return false;
            });

            helpersMock.expects('arrivedOnView').once();
            helpersMock.expects('navigateToDefaultLoggedIn').never();
            authController.routeSignup();

            assert(appSwitchViewStub.calledOnce);
            assert(appSwitchViewStub.calledWith(authLayoutView));
            assert(authLayoutViewShowChildViewStub.calledWith('authFormArea', signupView));

            assert(authLayoutViewStub.calledOnce);
            assert(signupViewStub.calledWithNew());
            assert(loginViewStub.notCalled);
        });
    });

    describe('#routeLogin()', function() {
        it('should redirect if user is already logged in', function() {
            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
            let sessionStub = sinon.stub(app.session, 'isValid', function() {
                return true;
            });

            helpersMock.expects('arrivedOnView').never();
            helpersMock.expects('navigateToDefaultLoggedIn').once();
            authController.routeLogin();

            assert(authLayoutViewStub.notCalled);
            assert(signupViewStub.notCalled);
            assert(loginViewStub.notCalled);
        });

        it('should render in root view if user is not logged in', function() {
            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
            let sessionStub = sinon.stub(app.session, 'isValid', function() {
                return false;
            });

            helpersMock.expects('arrivedOnView').once();
            helpersMock.expects('navigateToDefaultLoggedIn').never();
            authController.routeLogin();

            assert(appSwitchViewStub.calledOnce);
            assert(appSwitchViewStub.calledWith(authLayoutView));
            assert(authLayoutViewShowChildViewStub.calledWith('authFormArea', loginView));

            assert(authLayoutViewStub.calledOnce);
            assert(signupViewStub.notCalled);
            assert(loginViewStub.calledWithNew());
        });
    });

    describe('#routeLogout()', function() {
        it('should clear session', function() {
            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
            let sessionStub = sinon.stub(app.session, 'logout');

            authController.routeLogout();

            assert(sessionStub.calledOnce);
        });
    });
});

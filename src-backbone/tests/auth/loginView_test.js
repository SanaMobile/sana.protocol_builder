require('setup/hooks');

describe("Login View", function () {
    let app;
    let loginView;

    beforeEach(function() {
        // Setup app
        let SanaApp = proxyquire('sanaApp', {
            'behaviors/rightNavbarBehavior': {},
            'views/rootLayoutView'         : {},
            'routers/authRouter'           : {},
            'routers/infoRouter'           : {},
            'routers/proceduresRouter'     : {},
            'utils/helpers'                : {},
        });
        app = new SanaApp();
        app._loadBehaviors();
        let getAppInstance = function() {
            return app;
        };

        let LoginView = proxyquire('views/auth/loginView', {
            'templates/auth/loginView' : {},
            'utils/sanaAppInstance'    : getAppInstance,
        });
        loginView = new LoginView();
    });

    describe("behaviors", function() {
        it("has AuthFormBehavior", function() {
            assert.isObject(loginView.behaviors);
        });

        it("should call App().session.login() inside AuthFormBehavior.onAuthenticate", function() {
            let Session = require('models/session');
            app.session = new Session();
            let sessionLoginStub = sinon.stub(app.session, 'login');

            let formData = 'formData';
            let serverErrorHandler = 'serverErrorHandler';
            let networkErrorHandler = 'networkErrorHandler';
            loginView.behaviors.AuthFormBehavior.onAuthenticate(formData, serverErrorHandler, networkErrorHandler);

            assert(sessionLoginStub.calledOnce);
            assert(sessionLoginStub.calledWith(formData, serverErrorHandler, networkErrorHandler));
        });
    });

    describe("templateHelpers", function() {
        let helpers;

        beforeEach(function() {
            helpers = loginView.templateHelpers();
        });

        it("has 'remember' property that returns false for non-persistent storage", function() {
            app.storage = {
                isPersistent: false
            };

            assert.notOk(helpers.remember());
        });

        it("has 'remember' property that returns true for persistent storage", function() {
            app.storage = {
                isPersistent: true
            };

            assert.ok(helpers.remember());
        });
    });

    describe("#_onRememberChanged()", function() {
        let storageChangeEngineStub;

        beforeEach(function() {
            loginView.ui.rememberMeCheckbox = {
                is: function() { },
            };

            storageChangeEngineStub = sinon.stub();
            app.storage = {
                changeEngine: storageChangeEngineStub,
            };
        });

        it("change storage to localStorage if remembering", function() {
            sinon.stub(loginView.ui.rememberMeCheckbox, 'is').returns(true);
            loginView._onRememberChanged();
            storageChangeEngineStub.calledWith(localStorage, true);
        });

        it("change storage to sessionStorage if not remembering", function() {
            sinon.stub(loginView.ui.rememberMeCheckbox, 'is').returns(false);
            loginView._onRememberChanged();
            storageChangeEngineStub.calledWith(sessionStorage, false);
        });
    });

});

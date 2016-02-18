require('setup/hooks');

describe("Signup View", function () {
    let app;
    let loginView;

    beforeEach(function() {
        // Setup app
        let SanaApp = proxyquire('sanaApp', {
            'behaviors/choiceBasedElementBehavior': {},
            'behaviors/rightNavbarBehavior': {},
            'views/rootLayoutView': {},
            'routers/authRouter': {},
            'routers/infoRouter': {},
            'routers/proceduresRouter': {},
            'utils/helpers': {},
        });
        app = new SanaApp();
        app._loadBehaviors();
        let getAppInstance = function() {
            return app;
        };

        let LoginView = proxyquire('views/auth/signupView', {
            'templates/auth/signupView' : {},
            'utils/sanaAppInstance'     : getAppInstance,
        });
        loginView = new LoginView();
    });

    describe("behaviors", function() {
        it("has AuthFormBehavior", function() {
            assert.isObject(loginView.behaviors);
        });

        it("should call App().session.login() inside AuthFormBehavior.onAuthenticate", function() {
            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
            let sessionSignupStub = sinon.stub(app.session, 'signup');

            let formData = 'formData';
            let serverErrorHandler = 'serverErrorHandler';
            let networkErrorHandler = 'networkErrorHandler';
            loginView.behaviors.AuthFormBehavior.onAuthenticate(formData, serverErrorHandler, networkErrorHandler);

            assert(sessionSignupStub.calledOnce);
            assert(sessionSignupStub.calledWith(formData, serverErrorHandler, networkErrorHandler));
        });
    });

});

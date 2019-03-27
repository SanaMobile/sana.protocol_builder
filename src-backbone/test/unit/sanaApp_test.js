require('setup/hooks');

describe('SanaApp', function() {
    describe('#_setupSession()', function() {
        let app;
        let helpersMock;

        beforeEach(function() {
            let helpers = require('utils/helpers');
            helpersMock = sinon.mock(helpers);

            let SanaApp = proxyquire('sanaApp', {
                'views/rootLayoutView': {},
                'behaviors/authFormBehavior': {},
                'behaviors/choiceBasedElementBehavior': {},
                'behaviors/sortableBehavior': {},
                'behaviors/rightNavbarBehavior': {},
                'routers/authRouter': {},
                'routers/infoRouter': {},
                'routers/proceduresRouter': {},
                'routers/conceptsRouter': {},
                'routers/subroutinesRouter': {},
                'utils/helpers': helpers,
            });
            app = new SanaApp();
        });

        afterEach(function() {
            helpersMock.verify();
            helpersMock.restore();
        });

        it('should redirect user to logged in page if there is a token', function() {
            const KEY = require('models/session').AUTH_TOKEN_KEY;
            const TOKEN = 'fake_token';

            helpersMock.expects('navigateToDefaultLoggedIn').once();
            helpersMock.expects('navigateToDefaultLoggedOut').never();

            app._setupSession();
            app.session.set(KEY, TOKEN);
        });

        it('should redirect user to logged out page if there is no token', function() {
            const KEY = require('models/session').AUTH_TOKEN_KEY;
            const TOKEN = 'fake_token';

            helpersMock.expects('navigateToDefaultLoggedIn').never();
            helpersMock.expects('navigateToDefaultLoggedOut').once();

            app._setupSession();
            let attr = {};
            attr[KEY] = TOKEN;
            app.session.set(attr, { silent: true });
            app.session.unset(KEY);
        });
    });

    describe('#_setupAjaxPrefilters()', function() {
        let app;
        let server;

        beforeEach(function() {
            server = sinon.fakeServer.create();

            let SanaApp = proxyquire('sanaApp', {
                'views/rootLayoutView': {},
                'behaviors/authFormBehavior': {},
                'behaviors/choiceBasedElementBehavior': {},
                'behaviors/sortableBehavior': {},
                'behaviors/rightNavbarBehavior': {},
                'routers/authRouter': {},
                'routers/infoRouter': {},
                'routers/proceduresRouter': {},
                'routers/conceptsRouter': {},
                'routers/subroutinesRouter': {},
                'utils/helpers': {},
            });
            app = new SanaApp();

            let Storage = require('utils/storage');
            let Session = require('models/session');
            app.session = new Session({ storage: new Storage() });
        });

        afterEach(function() {
            server.restore();

            // We can't unbind $.ajaxPrefilter that uses session but at least we
            // can make the callback do nothing (i.e. do not attach RequestHeader)
            app.session.clear();
        });

        it('should set Authorization header if it has a token', function() {
            const KEY = require('models/session').AUTH_TOKEN_KEY;
            const TOKEN = 'fake_token';

            app._setupAjaxPrefilters();

            app.session.set(KEY, TOKEN);
            jQuery.ajax({
                url: '/test',
            });

            assert.lengthOf(server.requests, 1);
            assert.isString(server.requests[0].requestHeaders.Authorization);
            assert.include(server.requests[0].requestHeaders.Authorization, TOKEN);
        });

        it('should not set an Authorization header if it does not have a token', function() {
            const KEY = require('models/session').AUTH_TOKEN_KEY;

            app._setupAjaxPrefilters();

            app.session.unset(KEY);
            jQuery.ajax({
                url: '/test',
            });

            assert.lengthOf(server.requests, 1);
            assert.isUndefined(server.requests[0].requestHeaders.Authorization);
        });
    });
});

var CreateSuite = require('utils/create_suite');

CreateSuite('Smoke Test', function() {
    describe('Test suite can run', function () {
        it('Array#indexOf should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });

    describe('SanaApp', function() {
        var sana_app;

        beforeEach(function() {
            var SanaApp = require('sana_app');
            sana_app = new SanaApp();

            // Since we do not test views, we do not want to directly load routers
            // since they will in turn try to load undefined Handlebars templates
            sinon.stub(sana_app, '_load_routers');
            sana_app.init();
        });

        afterEach(function() {
            // We can't unbind $.ajaxPrefilter that uses session but at least we
            // can reset it to the default state so it will essentially be a nop
            sana_app.session.clear();
        });

        describe("#_setup_authentication()", function() {
            var server;

            beforeEach(function() {
                server = sinon.fakeServer.create();
            });

            afterEach(function() {
                server.restore();
            });

            it('should setup storage mechanism', function() {
                assert.isObject(sana_app.storage);
            });

            it('should setup authentication', function() {
                assert.isObject(sana_app.session);
            });

            it("should set Authorization header if it has a token", function() {
                var KEY = require('models/session').AUTH_TOKEN_KEY;
                var TOKEN = 'fake_token';

                sana_app.session.set(KEY, TOKEN);
                jQuery.ajax({
                    url: "/test",
                });

                assert.lengthOf(server.requests, 1);
                assert.isString(server.requests[0].requestHeaders.Authorization);
                assert.include(server.requests[0].requestHeaders.Authorization, TOKEN);
            });

            it("should not set an Authorization header if it does not have a token", function() {
                jQuery.ajax({
                    url: "/test",
                });

                assert.lengthOf(server.requests, 1);
                assert.isUndefined(server.requests[0].requestHeaders.Authorization);
            });
        });

        describe("#_setup_views()", function() {
            it('should initialize root view', function() {
                assert.isObject(sana_app.root_view);
            });
            it('should have listener on "request" events', function() {
                var root_view_stub = sinon.stub(sana_app.root_view, 'show_spinner');
                sana_app.session.trigger('request');
                assert(root_view_stub.calledOnce);
            });
            it('should have listener on "complete" events', function() {
                var root_view_stub = sinon.stub(sana_app.root_view, 'hide_spinner');
                sana_app.session.trigger('complete');
                assert(root_view_stub.calledOnce);
            });
        });

        describe("#_load_behaviors()", function() {
            it('should initialize behaviors', function() {
                assert.isObject(sana_app.Behaviors);
            });
        });
    });
});

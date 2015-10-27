var CreateSuite = require('utils/create_suite');

CreateSuite('Smoke Test', function() {
    describe('Array#indexOf', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });

    describe('SanaApp', function() {
        beforeEach(function() {
            var SanaApp = require('sana_app');
            this.sana_app = new SanaApp();
        });

        it('should initialize root view', function() {
            should.exist(this.sana_app.root_view);
        });

        it('should initialize behaviours', function() {
            should.exist(this.sana_app.Behaviors);
        });

        it('should load modules\' routers', function() {
            should.exist(this.sana_app.auth_router);
            should.exist(this.sana_app.procedure_router);
        });

        it('should setup storage mechanism', function() {
            should.exist(this.sana_app.storage);
        });

        it('should setup authentication', function() {
            should.exist(this.sana_app.session);
        });
    });
});

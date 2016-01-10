require('setup/hooks');

describe('Smoke Test', function() {
    describe('Test suite can run', function () {
        it('Array#indexOf should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});

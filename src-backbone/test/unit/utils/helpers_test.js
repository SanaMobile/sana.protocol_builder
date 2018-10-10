require('setup/hooks');

describe('Helpers', function() {
    const Helpers = require('utils/helpers');

    describe('test isValidUrl', function() {
        it('invalid url due to lack of protocol', function() {
            assert.equal(false, Helpers.isValidUrl('www.yourMdsUrl.com'));
        });

        it('valid http url', function() {
            assert.equal(true, Helpers.isValidUrl('http://www.yourMdsUrl.com'));
        });

        it('valid https url', function() {
            assert.equal(true, Helpers.isValidUrl('https://www.yourMdsUrl.com'));
        });
    });
});

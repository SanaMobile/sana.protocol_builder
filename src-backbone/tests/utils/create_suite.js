module.exports = function(name, tests) {

    return describe(name, function(){
        before(function(){
            // Emulate browser APIs
            global.document = require('jsdom').jsdom();
            global.window = document.defaultView;

            var Storage = require('node-localstorage').LocalStorage;
            global.localStorage = new Storage('/tmp/localStorage');
            global.sessionStorage = new Storage('/tmp/sessionStorage');

            // Load client libraries
            require('utils/setup').load_libs();

            // Load chai
            var chai = require('chai');
            global.assert = chai.assert
            global.expect = chai.expect
            global.should = chai.should();
        });

        tests();

        after(function(){
            global.localStorage._deleteLocation();
            global.sessionStorage._deleteLocation();
        });
    });

};

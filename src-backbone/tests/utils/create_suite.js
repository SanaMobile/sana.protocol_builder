// Emulate browser APIs
global.document = require("jsdom").jsdom();
global.window = document.defaultView;

// Load client libraries
require('utils/setup').load_libs();

// Setup sinon
global.XMLHttpRequest = window.XMLHttpRequest;
global.sinon = require('sinon');
$.support.cors = true;

// Setup chai
global.assert = require('chai').assert;


module.exports = function(name, tests) {
    return describe(name, function(){
        before(function(){
            var Storage = require('node-localstorage').LocalStorage;
            global.localStorage = new Storage('/tmp/localStorage');
            global.sessionStorage = new Storage('/tmp/sessionStorage');
        });

        tests();

        after(function(){
            global.localStorage._deleteLocation();
            global.sessionStorage._deleteLocation();
        });
    });
};

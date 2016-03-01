// Set up paths for require/proxyquire so they will search relative to these dir
let path = require('path');
process.env.NODE_PATH = 
    path.join(__dirname, '../../../app/js') + ':' +
    path.join(__dirname, '../../../test/unit')  + ':'
;
require('module').Module._initPaths();


// Load testing libs
global.assert = require('chai').assert;
global.proxyquire = require('proxyquire').noCallThru();


// Disable logs
console.info = function(){};
console.warn = function(){};
console.error = function(){};

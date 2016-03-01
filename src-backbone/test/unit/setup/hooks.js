before(function(){
    let Storage = require('node-localstorage').LocalStorage;
    global.localStorage = new Storage('/tmp/localStorage');
    global.sessionStorage = new Storage('/tmp/sessionStorage');
});

after(function(){
    global.localStorage._deleteLocation();
    global.sessionStorage._deleteLocation();
});

beforeEach(function() {
    // Emulate browser APIs
    global.document = require("jsdom").jsdom();
    global.window = document.defaultView;
    global.navigator = window.navigator;

    // Load client libraries
    require('utils/setup').loadLibs();

    // Load sinon
    global.XMLHttpRequest = window.XMLHttpRequest;
    global.sinon = require('sinon');
    $.support.cors = true;
});

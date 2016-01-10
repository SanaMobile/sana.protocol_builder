let Setup = require('utils/setup');
Setup.loadConfig();
Setup.loadLibs();


$(document).ready(function() {
    // Create app
    let SanaApp = require('./sanaApp');
    window.App = new SanaApp();
    window.App.init();
    window.App.start();
});

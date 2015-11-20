var Setup = require('utils/setup');
Setup.load_config();
Setup.load_libs();
Setup.load_logger(DEBUG);


$(document).ready(function() {
    // Create app
    var SanaApp = require('sana_app');
    window.App = new SanaApp();
    window.App.init();
    window.App.start();
});

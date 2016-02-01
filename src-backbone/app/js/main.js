require('utils/setup').loadLibs();


$(document).ready(function() {
    // Create app
    let SanaApp = require('./sanaApp');
    window.App = new SanaApp();
    window.App.init();

    i18n.init(function() {
        window.App.start();
    });
});

const App = require('utils/sanaAppInstance');
const LoggedInRightNavbarView = require('views/common/loggedInRightNavbarView');
const LoggedOutRightNavbarView = require('views/common/loggedOutRightNavbarView');


module.exports = Marionette.Behavior.extend({

    onBeforeShow: function() {
        if (App().session.isValid()) {
            this.view.showChildView('rightNavbar', new LoggedInRightNavbarView());
        } else {
            this.view.showChildView('rightNavbar', new LoggedOutRightNavbarView());
        }
    },

});

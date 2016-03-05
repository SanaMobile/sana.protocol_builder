const App = require('utils/sanaAppInstance');
const LanguageSelectorView = require('views/common/languageSelectorView');
const LoggedInRightNavbarView = require('views/common/loggedInRightNavbarView');
const LoggedOutRightNavbarView = require('views/common/loggedOutRightNavbarView');


module.exports = Marionette.Behavior.extend({

    onBeforeShow: function() {
 //       this.view.showChildView('languageSelector', new LanguageSelectorView());

        if (App().session.isValid()) {
            this.view.showChildView('rightNavbar', new LoggedInRightNavbarView());
        } else {
            this.view.showChildView('rightNavbar', new LoggedOutRightNavbarView());
        }
    },

});

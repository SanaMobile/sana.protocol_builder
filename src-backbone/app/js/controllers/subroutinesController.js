const Config = require('utils/config');

const App             = require('utils/sanaAppInstance');
const Helpers         = require('utils/helpers');

const SubroutinesLayout = require('views/subroutines/subroutinesLayoutView');

module.exports = Marionette.Controller.extend({

    routeSubroutines: function () {
        if (!App().session.isValid()) {
            Helpers.navigateToDefaultLoggedOut();
            return;
        }

        if (!App().session.user.isPriveleged()) {
            Helpers.navigateToDefaultLoggedIn();
            return;
        }

        Helpers.arrivedOnView('Subroutines');

        let subroutineView = new SubroutinesLayout();
        App().RootView.clearNotifications(); // Clear login errors
        App().RootView.switchMainView(subroutineView, 'subroutinesView');
    }
});

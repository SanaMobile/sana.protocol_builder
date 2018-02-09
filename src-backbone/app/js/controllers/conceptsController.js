const Config = require('utils/config');

const App                  = require('utils/sanaAppInstance');
const Helpers              = require('utils/helpers');
const ConceptsLayout       = require('views/concepts/conceptsLayoutView');
const ConceptsUploaderView = require('views/concepts/conceptsUploaderView');

module.exports = Marionette.Controller.extend({

    routeUploader: function () {
        if (!App().session.isValid()) {
            Helpers.navigateToDefaultLoggedOut();
            return;
        }

        if (!App().session.user.isPriveleged()) {
            Helpers.navigateToDefaultLoggedIn();
            return;
        }
        Helpers.arrivedOnView('Concepts Uploader');

        let conceptsView = new ConceptsLayout();
        App().RootView.clearNotifications(); // Clear login errors
        App().RootView.switchMainView(conceptsView, 'concepts');
        conceptsView.showChildView('conceptFormArea', new ConceptsUploaderView());
    },

    routeManager: function () {
        if (!App().session.isValid()) {
            Helpers.navigateToDefaultLoggedOut();
            return;
        }

        if (!App().session.user.isPriveleged()) {
            Helpers.navigateToDefaultLoggedIn();
            return;
        }
        Helpers.arrivedOnView('Concepts Manager');
    }
});

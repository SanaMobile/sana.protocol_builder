const Config = require('utils/config');

let App                  = require('utils/sanaAppInstance');
let Helpers              = require('utils/helpers');
let ConceptsLayout       = require('views/concepts/conceptsLayoutView');
let ConceptsUploaderView = require('views/concepts/conceptsUploaderView');


module.exports = Marionette.Controller.extend({

    routeUploader: function () {
        if (!App().session.isPriveleged()) {
            if (App().session.isValid()) {
                Helpers.navigateToDefaultLoggedIn();
            } else {
                Helpers.navigateToDefaultLoggedOut();
            }
            return;
        }
        Helpers.arrivedOnView('Concepts');

        let conceptsView = new ConceptsLayout();
        App().RootView.clearNotifications(); // Clear login errors
        App().RootView.switchMainView(conceptsView, 'concepts');
        conceptsView.showChildView('conceptFormArea', new ConceptsUploaderView());
    },
});

let App        = require('sanaAppInstance');
let Helpers    = require('utils/helpers');
let InfoLayout = require('views/info/infoLayoutView');


module.exports = Marionette.Controller.extend({

    routeTermsOfService: function () {
        Helpers.arrivedOnView('Terms of Service');

        let infoLayout = new InfoLayout();
        App().switchView(infoLayout);
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/info/termsOfServiceView'),
        }));
    },
  
    routePrivacyPolicy: function() {
        Helpers.arrivedOnView('Privacy Policy');

        let infoLayout = new InfoLayout();
        App().switchView(infoLayout);
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/info/privacyPolicyView'),
        }));
    },
  
    routeError404NotFound: function() {
        Helpers.arrivedOnView('404');

        let infoLayout = new InfoLayout();
        App().switchView(infoLayout);
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/errors/404NotFoundView'),
        }));
    },

});

let App        = require('utils/sanaAppInstance');
let Helpers    = require('utils/helpers');
let InfoLayout = require('views/info/infoLayoutView');


module.exports = Marionette.Controller.extend({

    routeTermsOfService: function () {
        Helpers.arrivedOnView('Terms of Service');

        let infoLayout = new InfoLayout();
        App().switchMainView(infoLayout, 'info');
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/info/termsOfServiceView'),
        }));
    },
  
    routePrivacyPolicy: function() {
        Helpers.arrivedOnView('Privacy Policy');

        let infoLayout = new InfoLayout();
        App().switchMainView(infoLayout, 'info');
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/info/privacyPolicyView'),
        }));
    },
  
    routeError404NotFound: function() {
        Helpers.arrivedOnView('404');

        let infoLayout = new InfoLayout();
        App().switchMainView(infoLayout, 'info e404');
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/errors/404NotFoundView'),
        }));
    },

});

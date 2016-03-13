let App        = require('utils/sanaAppInstance');
let Helpers    = require('utils/helpers');
let InfoLayout = require('views/info/infoLayoutView');


module.exports = Marionette.Controller.extend({

    routeCredits: function() {
        Helpers.arrivedOnView('Credits');

        let infoLayout = new InfoLayout();
        App().RootView.switchMainView(infoLayout, 'info');
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/info/creditsView'),
        }));
    },

    routeError404NotFound: function() {
        Helpers.arrivedOnView('404');

        let infoLayout = new InfoLayout();
        App().RootView.switchMainView(infoLayout, 'info e404');
        infoLayout.showChildView('infoArea', new Marionette.ItemView({
            template: require('templates/errors/404NotFoundView'),
        }));
    },

});

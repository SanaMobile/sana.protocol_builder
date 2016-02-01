let App = require('utils/sanaAppInstance');
const RightNavbarView = require('views/common/rightNavbarView');


module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/info/infoLayoutView'),

    regions: {
        infoArea: 'article#info'
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
    },

});

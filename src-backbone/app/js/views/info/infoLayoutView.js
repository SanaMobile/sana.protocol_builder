let App = require('utils/sanaAppInstance');


module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/info/infoLayoutView'),

    regions: {
        infoArea: 'article#info'
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new Marionette.ItemView({
            template: require('templates/auth/authNavbarView'),
            tagName: 'div',
            className: 'container-fluid spb-container',
        }));
    },

});

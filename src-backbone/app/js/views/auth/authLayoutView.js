const App = require('utils/sanaAppInstance');
const RightNavbarView = require('views/common/rightNavbarView');


module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/auth/authLayoutView'),

    regions: {
        authFormArea: '#auth-form-area'
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
    },

});

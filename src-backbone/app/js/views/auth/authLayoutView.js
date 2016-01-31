const App = require('utils/sanaAppInstance');


module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/auth/authLayoutView'),

    regions: {
        authFormArea: '#auth-form-area'
    },

    onBeforeShow: function() {
        App().switchNavbar(new Marionette.ItemView({
            template: require('templates/auth/authNavbarView'),
            tagName: 'div',
            className: 'container-fluid spb-container',
        }));
    },

});

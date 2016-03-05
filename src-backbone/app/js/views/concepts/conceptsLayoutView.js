const App = require('utils/sanaAppInstance');
const RightNavbarView = require('views/common/rightNavbarView');


module.exports = Marionette.LayoutView.extend({
    template: require('templates/concepts/conceptsLayoutView'),

    regions: {
        conceptFormArea: '#concept-form-area'
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
    },

});

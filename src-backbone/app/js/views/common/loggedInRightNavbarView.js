const App                   = require('utils/sanaAppInstance');
const LanguageSelectorView  = require('./languageSelectorView');
const User                  = require('models/user');


module.exports = Marionette.LayoutView.extend({

    initialize: function() {
        this.model = App().session.user;
    },

    template: require('templates/common/loggedInRightNavbarView'),

});

const App                   = require('utils/sanaAppInstance');
const LanguageSelectorView  = require('./languageSelectorView');
const User                  = require('models/user');
const USER_STORAGE_KEY      = require('models/session').USER_STORAGE_KEY;


module.exports = Marionette.LayoutView.extend({

	initialize: function() {
        this.model = new User(App().session.get(USER_STORAGE_KEY));
	},

    template: require('templates/common/loggedInRightNavbarView'),

});

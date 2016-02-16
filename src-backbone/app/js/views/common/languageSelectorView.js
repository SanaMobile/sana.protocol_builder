const App = require('utils/sanaAppInstance');


module.exports = Marionette.ItemView.extend({

    template: require('templates/common/languageSelectorView'),

    events: {
        'click ul.language a': '_onChangeLanguage',
    },

    _onChangeLanguage: function(event) {
        event.preventDefault();

        let lang = $(event.target).attr('data-lang');
        App().changeLanguage(lang);
    },

});

const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/subroutines/subroutineCollectionEmptyView'),
    tagName: 'div',
    className: 'empty-subroutines',

    templateHelpers: function() {
        return {
            canUseSubroutinesManager: App().session.user.isPriveleged(),
        };
    },

});

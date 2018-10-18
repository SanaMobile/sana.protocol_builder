const App = require('utils/sanaAppInstance');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/concepts/conceptCollectionEmptyView'),
    tagName: 'div',
    className: 'empty-concepts',

    templateHelpers: function() {
        return {
            canUseConceptsManager: App().session.user.isPriveleged(),
        };
    },

});

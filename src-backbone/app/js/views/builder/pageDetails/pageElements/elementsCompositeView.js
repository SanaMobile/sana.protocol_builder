const Config = require('utils/config');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/elementsCompositeView'),
    emptyView: require('./emptyElementsView'),
    childView: require('./elementItemView'),
    childViewContainer: 'ul#elements-list',

    initialize: function() {
        if (!this.model) {
            return;
        }

        this.collection = this.model.elements;
    },

});

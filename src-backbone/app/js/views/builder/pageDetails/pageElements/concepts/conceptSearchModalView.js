const ConceptSearch = require('collections/concepts');


module.exports = Marionette.CompositeView.extend({

    template: require('templates/builder/pageDetails/pageElements/concepts/conceptSearchModalView'),

    childView: require('./conceptListItemView'),

    childViewContainer: 'table#concept-table',

    events: {
        'keyup #search-field': '_onKeyUpInput',
    },

    initialize: function() {
        this.collection = new ConceptSearch();
    },

    _onKeyUpInput: function(event) {
        this.collection.query = event.target.value;
        this.collection.fetch();
    },

});

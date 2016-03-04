const ConceptCollectionView = require('./conceptCollectionView');
const ConceptSearch = require('collections/concepts');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageElements/concepts/conceptSearchModalView'),

    regions: {
        conceptTable: 'section#concept-table',
    },

    ui: {
        'searchField': 'input#search-field',
    },

    events: {
        'keyup @ui.searchField': '_onKeyUpInput',
    },

    initialize: function() {
        this.concepts = new ConceptSearch();
    },

    onBeforeShow: function() {
        this._conceptCollectionView = new ConceptCollectionView({
            collection: this.concepts,
        });
        this.showChildView('conceptTable', this._conceptCollectionView);
    },

    _onKeyUpInput: function(event) {
        this.concepts.query = event.target.value;
        this.concepts.fetch();
    },

});

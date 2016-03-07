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

    initialize: function(options) {
        this.page = options.page;
        this.concepts = new ConceptSearch();
    },

    onBeforeShow: function() {
        let conceptCollectionView = new ConceptCollectionView({
            page: this.page,
            collection: this.concepts,
        });
        this.showChildView('conceptTable', conceptCollectionView);
    },

    _onKeyUpInput: function(event) {
        this.concepts.query = event.target.value;
        this.concepts.fetch();
    },

});

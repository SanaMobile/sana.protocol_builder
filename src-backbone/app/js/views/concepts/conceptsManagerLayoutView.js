const App = require('utils/sanaAppInstance');


const ConceptsCollection = require('collections/concepts');

const RightNavbarView = require('views/common/rightNavbarView');
const ConceptListView = require('./conceptsManagerListView');
const ConceptDetailsView = require('./conceptsManagerDetailsLayoutView');

module.exports = Marionette.LayoutView.extend({
    template: require('templates/concepts/conceptsManagerLayoutView'),

    regions: {
        conceptsList: 'section#concepts-list div.collection-view',
        pageDetails: 'section#page-details',
    },

    ui: {
        'searchField': 'input#search-field',
    },

    events: {
        'keyup @ui.searchField': '_onKeyUpInput',
        'click a#create-new-concept-btn': '_onCreateNewConcept',
    },

    initialize: function() {
        this.concepts = new ConceptsCollection();
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
        this.showChildView('conceptsList', new ConceptListView({collection: this.concepts}));
        this.showChildView('pageDetails', new ConceptDetailsView({collection: this.concepts}));
    },

    _onKeyUpInput: function(event) {
        this.concepts.query = event.target.value;
        this.concepts.fetch();
    },

    _onCreateNewConcept: function(event) {
        this.concepts.createNewConcept();
    },

});

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

    initialize: function(options) {
        this.concepts = new ConceptsCollection();
        // console.log(this.concepts);
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
        this.showChildView('conceptsList', new ConceptListView({collection: this.concepts}));
        this.showChildView('pageDetails', new ConceptDetailsView());
    },

});

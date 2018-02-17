const App = require('utils/sanaAppInstance');

const ConceptsCollection = require('collections/concepts');

const RightNavbarView = require('views/common/rightNavbarView');
const ConceptListView = require('./conceptsManagerListView');

module.exports = Marionette.LayoutView.extend({
    template: require('templates/concepts/conceptsManagerLayoutView'),

    regions: {
        pageList: 'section#pages-list div.collection-view',
        pageDetails: 'section#page-details',
    },

    initialize: function(options) {
        this.concepts = new ConceptsCollection();
        // console.log(this.concepts);
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
        this.showChildView('pageList', new ConceptListView({collection: this.concepts}));
    },

});

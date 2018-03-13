const App = require('utils/sanaAppInstance');

const SubroutinesCollection = require('collections/subroutines');

const RightNavbarView = require('views/common/rightNavbarView');
const SubroutinesListView = require('./subroutinesListView');
const SubroutinesDetailsView = require('./subroutinesDetailsLayoutView');

module.exports = Marionette.LayoutView.extend({
    template: require('templates/subroutines/subroutinesLayoutView'),

    regions: {
        subroutinesList: 'section#subroutines-list div.collection-view',
        pageDetails: 'section#page-details',
    },

    ui: {
        'searchField': 'input#search-field',
    },

    events: {
        'keyup @ui.searchField': '_onKeyUpInput',
        'click a#create-new-subroutine-btn': '_onCreateNewSubroutine',
    },

    initialize: function() {
        this.subroutines = new SubroutinesCollection();
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new RightNavbarView());
        this.showChildView('subroutinesList', new SubroutinesListView({collection: this.subroutines}));
        this.showChildView('pageDetails', new SubroutinesDetailsView({collection: this.subroutines}));
    },

    _onKeyUpInput: function(event) {
        this.subroutines.query = event.target.value;
        this.subroutines.fetch();
    },

    _onCreateNewConcept: function(event) {
        this.subroutines.createNewSubroutine();
    },

});

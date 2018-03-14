const SubroutineCollectionView = require('./subroutineCollectionView');
const SubroutineSearch = require('collections/subroutines');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/pageDetails/pageElements/subroutines/subroutineSearchModalView'),

    regions: {
        subroutineTable: 'section#subroutine-table',
    },

    ui: {
        'searchField': 'input#search-field',
    },

    events: {
        'keyup @ui.searchField': '_onKeyUpInput',
    },

    initialize: function(options) {
        this.page = options.page;
        this.subroutines = new SubroutineSearch();
    },

    onBeforeShow: function() {
        let subroutineCollectionView = new SubroutineCollectionView({
            page: this.page,
            collection: this.subroutines,
        });
        this.showChildView('subroutineTable', subroutineCollectionView);
    },

    _onKeyUpInput: function(event) {
        this.subroutines.query = event.target.value;
        this.subroutines.fetch();
    },

});

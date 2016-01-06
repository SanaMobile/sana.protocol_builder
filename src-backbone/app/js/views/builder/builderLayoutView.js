let Helpers   = require('utils/helpers');
let Procedure = require('models/procedure');

let NavbarView             = require('./builderNavbarView');
let MetaDataView           = require('./builderHeaderView');
let PageListCollectionView = require('./pageList/pageListCollectionView');
let PageDetailsLayoutView  = require('./pageDetails/pageDetailsLayoutView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/builderLayoutView'),

    regions: {
        navbar: 'nav#builder-navbar',
        metaData: 'header#builder-meta-data',
        pageList: 'section#pages-list div.collection-view',
        pageDetails: 'section#page-details',
    },

    events: {
        'click a#create-new-page-btn': 'createNewPage',
    },

    initialize: function() {
        let procedureId = this.model.get('id');
        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            if (page) {
                let pageId = page.get('id');
                Backbone.history.navigate('procedures/' + procedureId + '/page/' + pageId);
            } else {
                Backbone.history.navigate('procedures/' + procedureId);
            }
        });
    },

    onBeforeShow: function() {
        this.showChildView('navbar', new NavbarView({ model: this.model }));
        this.showChildView('metaData', new MetaDataView({ model: this.model }));
        this.showChildView('pageList', new PageListCollectionView({ collection: this.model.pages }));
        this.showChildView('pageDetails', new PageDetailsLayoutView({ model: this.model }));
    },

    createNewPage: function(event) {
        event.preventDefault();
        this.model.createNewPage();
    },

});

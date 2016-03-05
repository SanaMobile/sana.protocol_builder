const EventKeys = require('utils/eventKeys');

let App       = require('utils/sanaAppInstance.js');
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
        const procedureId = this.options.procedureId;

        this.model = new Procedure({
            // Model attributes
            id: procedureId,
        }, {
            // Options passed to model constructor
            activePageId: this.options.pageId,
        });

        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            if (page) {
                const pageId = page.get('id');
                Backbone.history.navigate('procedures/' + procedureId + '/page/' + pageId);
            } else {
                Backbone.history.navigate('procedures/' + procedureId);
            }
        });
    },

    onBeforeShow: function() {
        App().RootView.switchNavbar(new NavbarView({ model: this.model }));
        this.showChildView('metaData', new MetaDataView({ model: this.model }));
        this.showChildView('pageList', new PageListCollectionView({ collection: this.model.pages }));
        this.showChildView('pageDetails', new PageDetailsLayoutView({ model: this.model }));
    },

    onAttach: function() {
        const procedureId = this.model.get('id');

        let self = this;
        this.model.fetch({
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function() {
                console.info('Fetched Procedure', procedureId);
            },
            error: function() {
                console.warn('Failed to fetch Procedure', procedureId);
                App().RootView.showNotification('Failed to fetch Procedure!');
            },
        });
    },

    createNewPage: function(event) {
        event.preventDefault();
        this.model.createNewPage();
    },

});

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

    constructor: function(options) {
        this.model = new Procedure({
            // model attributes
            id: options.procedureId,
        }, {
            // options passed to model constructor
            loadDetails: true,
            activePageId: options.pageId,
        });

        Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    initialize: function() {
        const procedureId = this.model.get('id');

        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT, function(page) {
            if (page) {
                const pageId = page.get('id');
                Backbone.history.navigate('procedures/' + procedureId + '/page/' + pageId);
            } else {
                Backbone.history.navigate('procedures/' + procedureId);
            }
        });

        this.model.fetch({
            success: function() {
                console.info('Fetched Procedure', procedureId);
            },
            error: function() {
                console.warn('Failed to fetch Procedure', procedureId);
                App().showNotification('danger', 'Failed to fetch Procedure!');
            },
        });
    },

    onBeforeShow: function() {
        App().switchNavbar(new NavbarView({ model: this.model }));
        this.showChildView('metaData', new MetaDataView({ model: this.model }));
        this.showChildView('pageList', new PageListCollectionView({ collection: this.model.pages }));
        this.showChildView('pageDetails', new PageDetailsLayoutView({ model: this.model }));
    },

    createNewPage: function(event) {
        event.preventDefault();
        this.model.createNewPage();
    },

});

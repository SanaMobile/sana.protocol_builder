let Helpers   = require('utils/helpers');
let Procedure = require('models/procedure_model');

let NavbarView             = require('./navbar');
let MetaDataView           = require('./header');
let PageListCollectionView = require('./page_list/collection_view');
let PageDetailsLayout      = require('./page_details/layout');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/procedures_builder/main_layout'),

    regions: {
        navbar: 'nav#builder-navbar',
        meta_data: 'header#builder-meta-data',
        page_list: 'section#pages-list div.collection-view',
        page_details: 'section#page-details',
    },

    events: {
        'click a#create-new-page-btn': 'create_new_page',
    },

    initialize: function() {
        let procedure_id = this.model.get('id');
        this.model.on(Procedure.ACTIVE_PAGE_CHANGE_EVENT_KEY, function(page_model) {
            if (page_model) {
                let page_id = page_model.get('id');
                Backbone.history.navigate('procedures/' + procedure_id + '/page/' + page_id);
            } else {
                Backbone.history.navigate('procedures/' + procedure_id);
            }
        });
    },

    onBeforeShow: function() {
        this.showChildView('navbar', new NavbarView({ model: this.model }));
        this.showChildView('meta_data', new MetaDataView({ model: this.model }));
        this.showChildView('page_list', new PageListCollectionView({ collection: this.model.pages }));
        this.showChildView('page_details', new PageDetailsLayout({ model: this.model }));
    },

    create_new_page: function(event) {
        event.preventDefault();
        this.model.create_new_page();
    },

});

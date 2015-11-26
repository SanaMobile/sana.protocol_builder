module.exports = Marionette.LayoutView.extend({

    template: require('templates/procedures/procedures_layout'),

    ui: {
        search_input: 'input#filter-input',
        sort_toolbar_dropdown: '#procedure-list-toolbar ul.dropdown-menu',
    },

    regions: {
        top_navbar: '#top-navbar',
        procedures_list: '#procedures-list',
    },

    events: {
        'click a#new-procedure-btn': 'create_new_procedure',
        'keyup @ui.search_input': 'filter_procedures',

        'click a#sort-by-title': 'change_sort_key',
        'click a#sort-by-author': 'change_sort_key',
        'click a#sort-by-last-modified': 'change_sort_key',

        'click a#asc-order': 'change_sort_order',
        'click a#desc-order': 'change_sort_order',
    },

    constructor: function(options = {}) {
        this.app                      = options.app                      || global.App;
        this.ProceduresCollection     = options.ProceduresCollection     || require('models/procedures_collection');
        this.Procedure                = options.Procedure                || require('models/procedures_model');
        this.AccountNavbarView        = options.AccountNavbarView        || require('views/procedures/account_navbar_view');
        this.ProceduresCollectionView = options.ProceduresCollectionView || require('views/procedures/procedures_collection_view');
        this.Helpers                  = options.Helpers                  || require('utils/helpers');

        Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    initialize: function() {
        // Setup data
        var self = this;
        this.procedures_collection = new this.ProceduresCollection();
        this.procedures_collection.fetch({
            beforeSend: function() {
                self.app.session.trigger('request'); // TODO
            },
            complete: function() {
                self.app.session.trigger('complete');
            },
        });
    },

    onRender: function() {
        this._update_toolbar_options();

        // Account navbar
        this.account_navbar_view = new this.AccountNavbarView();
        this.account_navbar_view.render();
        this.getRegion('top_navbar').show(this.account_navbar_view);

        // Procedures collection
        this.procedures_collection_view = new this.ProceduresCollectionView({
            collection: this.procedures_collection,
        });
        this.procedures_collection_view.render();
        this.getRegion('procedures_list').show(this.procedures_collection_view);
    },

    _update_toolbar_options: function() {
        var sort_key = this.procedures_collection.get_comparator_key();
        var sort_order = this.procedures_collection.get_order_name();

        this.ui.sort_toolbar_dropdown.find('a').removeClass();
        this.ui.sort_toolbar_dropdown.find('a[data-sort-key=' + sort_key + ']').addClass('active');
        this.ui.sort_toolbar_dropdown.find('a[data-sort-order=' + sort_order + ']').addClass('active');
    },

    create_new_procedure: function (event) {
        event.preventDefault();

        var self = this;
        var new_procedure = new this.Procedure({
            author: 'Stephen' // TODO either fetch user's username or let API allow nullable authors
        }, {
            collection: this.procedures_collection
        });
        new_procedure.save({}, {
            beforeSend: function() {
                self.app.session.trigger('request'); // TODO
            },
            complete: function() {
                self.app.session.trigger('complete');
            },
            success: function() {
                self.procedures_collection.add(new_procedure);
            },
        });
    },

    filter_procedures: function(event) {
        var query = this.ui.search_input.val();

        if (query) {
            var pattern = new RegExp(query, 'i'); // i = ignore case
            this.procedures_collection_view.filter = function (child, index, collection) {
                return pattern.test(child.get('title'));
            };
        } else {
            this.procedures_collection_view.filter = null;
        }

        this.procedures_collection_view.render();
    },

    change_sort_key: function(event) {
        var key = $(event.toElement).attr('data-sort-key');
        this.procedures_collection.set_comparator_key(key);
        this.procedures_collection.sort();
        this._update_toolbar_options();
    },

    change_sort_order: function(event) {
        var sort_asc = $(event.toElement).attr('data-sort-order') === 'asc';
        this.procedures_collection.set_order_asc(sort_asc);
        this.procedures_collection.sort();
        this._update_toolbar_options();
    },

});

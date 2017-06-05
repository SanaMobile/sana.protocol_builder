const EventKeys = require('utils/eventKeys');

let App        = require('utils/sanaAppInstance');
let Helpers    = require('utils/helpers');
let Procedure  = require('models/procedure');
let Procedures = require('collections/procedures');

let ProceduresNavbarView     = require('views/procedures/proceduresNavbarView');
let ProceduresCollectionView = require('views/procedures/proceduresCollectionView');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/procedures/proceduresLayoutView'),

    templateHelpers: function() {
        return {
            copyrightYear: new Date().getFullYear(),
        };
    },

    ui: {
        procedureFilterInput: 'input#procedure-filter',
        sortToolbarDropdown: '#procedure-list-toolbar ul.dropdown-menu',
        procedureFileInput: 'input#procedure-file-input',
    },

    regions: {
        proceduresList: 'section#procedures-list',
    },

    events: {
        'click a#new-procedure-btn': '_createNewProcedure',
        'click a#import-procedure-btn': '_importProcedure',
        'change input#procedure-file-input': '_readInputFile',
        'keyup @ui.procedureFilterInput': '_filterProcedures',

        'click a#sort-by-title': '_changeSortKey',
        'click a#sort-by-author': '_changeSortKey',
        'click a#sort-by-last-modified': '_changeSortKey',

        'click a#asc-order': '_changeSortOrder',
        'click a#desc-order': '_changeSortOrder',
    },

    initialize: function() {
        this.procedures = new Procedures();
    },

    onBeforeShow: function() {
        this._updateToolbarOptions();

        // Account navbar
        let navbarView = new ProceduresNavbarView();
        App().RootView.switchNavbar(navbarView);

        // Procedures collection
        this._proceduresCollectionView = new ProceduresCollectionView({
            collection: this.procedures,
        });
        this.showChildView('proceduresList', this._proceduresCollectionView);
    },

    onAttach: function() {
        let self = this;
        this.procedures.fetch({
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function() {
                console.info('Fetched Procedures');
            },
            error: function() {
                console.warn('Failed to fetch Procedures');
                App().RootView.showNotification('Failed to fetch Procedures!');
            },
        });
    },

    _createNewProcedure: function (event) {
        let procedure = new Procedure(); // Does not need to set 'collection' option because it already has a urlRoot property
        procedure.save({}, {
            success: function() {
                console.info('Created Procedure', procedure.id);
                Backbone.history.navigate('/procedures/' + procedure.id, { trigger: true });
            },
            error: function() {
                console.warn('Failed to create Procedure!');
                App().RootView.showNotification('Failed to create Procedure!');
            },
        });
    },

    _importProcedure: function(event) {
        this.ui.procedureFileInput.click();
    },

    _readInputFile: function(event) {
        console.log(event.target.files);

        if (event.target.files.length <= 0) {
            return;
        }

        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = (function() {
            this._uploadToServer(file.name, reader.result);
        }).bind(this);

        reader.readAsText(file, "UTF-8");

        event.target.value = null;
    },

    _uploadToServer: function(filename, filecontent) {
        $.ajax({
            type: 'POST',
            url: '/api/procedures/import_from_xml',
            data: {
                'filename': filename, 
                'filecontent': filecontent
            },
            dataType: "text",
            success: function onGenerateSuccess(data, status, jqXHR) {
                Backbone.history.loadUrl(Backbone.history.fragment);
                App().RootView.showNotification({
                    title: i18n.t('Success!'),
                    desc: i18n.t('Imported procedure from ' + filename),
                    alertType: 'success',
                });
            },
            error: function onGenerateError(jqXHR, textStatus, errorThrown) {
                console.warn('Failed to import Procedure from ' + filename, textStatus);
                App().RootView.showNotification({
                    title: i18n.t('Failed to import Procedure from', {fileName: filename}),
                    desc: jqXHR.responseText,
                });
            },
        });
    },

    _filterProcedures: function(event) {
        let query = this.ui.procedureFilterInput.val();

        if (query) {
            let pattern = new RegExp(query, 'i'); // i = ignore case
            this._proceduresCollectionView.filter = function (child, index, collection) {
                return pattern.test(child.get('title'));
            };
        } else {
            this._proceduresCollectionView.filter = null;
        }

        this._proceduresCollectionView.render();
    },

    _changeSortKey: function(event) {
        let key = $(event.toElement).attr('data-sort-key');
        this.procedures.setComparatorKey(key);
        this.procedures.sort();
        this._updateToolbarOptions();
    },

    _changeSortOrder: function(event) {
        let isAsc = $(event.toElement).attr('data-sort-order') === 'asc';
        this.procedures.setAscOrder(isAsc);
        this.procedures.sort();
        this._updateToolbarOptions();
    },

    _updateToolbarOptions: function() {
        let sortKey = this.procedures.getComparatorKey();
        let sortOrder = this.procedures.getOrderName();

        this.ui.sortToolbarDropdown.find('a').removeClass();
        this.ui.sortToolbarDropdown.find('a[data-sort-key=' + sortKey + ']').addClass('active');
        this.ui.sortToolbarDropdown.find('a[data-sort-order=' + sortOrder + ']').addClass('active');
    },

});

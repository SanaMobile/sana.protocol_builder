const Config  = require('utils/config');
const Helpers = require('utils/helpers');
const App     = require('utils/sanaAppInstance');
const PushToMDSUtils = require('utils/pushToMDSUtils');

const ModalLayoutView = require('views/common/modalLayoutView');
const FlowchartView = require('./flowchartView');

let Procedure  = require('models/procedure');
let Page = require('models/page');
let Element = require('models/element');

let ProcedureVersions = require('collections/procedureVersions');

let BuilderVersionCollectionView = require('views/builder/builderVersionCollectionView');

module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/builderHeaderView'),

    ui: {
        titleField: 'input#change-title',
        authorField: 'input#change-author',
        versionSelector: 'select#builder-select-version-view',
        downloadButton: 'a#download-btn',
        saveButton: 'a#save-btn',
        pushButton: 'a#push-btn',
        visualizeButton: 'a#visualize-btn',
        saveVersionButton: 'a#save-version-btn',
    },

    events: {
        'keyup @ui.titleField': '_save',
        'keyup @ui.authorField': '_save',
        'click @ui.downloadButton': '_download',
        'click @ui.saveButton':  '_saveProcedure',
        'click @ui.pushButton': '_pushToMDS',
        'click @ui.visualizeButton': '_visualize',
        'click @ui.saveVersionButton': '_saveNewProcedureVersion',
        'change @ui.versionSelector': '_selectVersion',
    },

    modelEvents: {
        'change:title': '_renderOnce',
        'change:author': '_renderOnce',
    },

    regions: {
        procedureVersionSelect: 'section#procedures-version-list',
    },

    initialize: function() {
        this.versions = new ProcedureVersions(null, {id: this.model.get('id')});
    },

    onBeforeShow: function() {
        // Procedure versions collection
        this._versionCollection = new BuilderVersionCollectionView({
            collection: this.versions,
            selectedVersion: this.model.get('id'),
        });
        this.showChildView('procedureVersionSelect', this._versionCollection);
    },

    onAttach: function() {
        this.versions.fetch({
            success: function() {
                console.info('Fetched Procedures Versions');
            },
        });
    },

    _save: _.debounce(function() {
        this._saveToServer();
    }, Config.INPUT_DELAY_BEFORE_SAVE),

    _saveProcedure: function() {
        this.model.save();
        this.model.pages.forEach(function(page) {
            page.elements.forEach(function(element) {
                element.debounceSave();
            });
        });
    },

    _saveNewProcedureVersion: function() {
        // Call the django api
        $.ajax({
            type: 'POST',
            url: '/api/procedures/create_new_version',
            data: {
                'id': this.model.get('id')
            },
            dataType: "text",
            success: function onGenerateSuccess(data, status, jqXHR) {
                const newVersionId = JSON.parse(data).id;
                Backbone.history.navigate('procedures/' + newVersionId, {trigger: true});
            },
            error: function onGenerateError(jqXHR, textStatus, errorThrown) {
                console.warn('Failed to create version:', response.responseJSON);
                App().RootView.showNotification('Failed to create new version');
            },
        });
    },

    _renderOnce: _.once(function() {
        this.render();
    }),

    _saveToServer: function() {
        let self = this;
        this.model.save({
            title: this.ui.titleField.val(),
            author: this.ui.authorField.val(),
        }, {
            success: function() {
                self._updateVersions();
            },
            error: function(model, response, options) {
                console.warn('Failed to save Procedure meta data:', response.responseJSON);
                App().RootView.showNotification('Failed to save title and author!');
            },
        });
    },

    _download: function(event) {
        event.preventDefault();
        const filename = this.model.get('title') + '.xml';

        this.model.generate(function onSuccess(data, status, jqXHR) {
            Helpers.downloadXMLFile(data, filename);
        }, function onError(jqXHR, textStatus, errorThrown) {
            console.warn('Failed to generate Procedure', textStatus);
        });
    },

    _pushToMDS: function() {
        PushToMDSUtils.pushToMDS(this.model.get('id'));
    },

    _visualize: function() {
        console.log('visualizing');

        const modalView = new ModalLayoutView({
            title: i18n.t('Flowchart'),
            bodyView: new FlowchartView({model: this.model}),
        });
        App().RootView.showModal(modalView);
    },

    _selectVersion: function() {
        Backbone.history.navigate('procedures/' + $("select#builder-select-version-view").val(), {trigger: true});
    },

});

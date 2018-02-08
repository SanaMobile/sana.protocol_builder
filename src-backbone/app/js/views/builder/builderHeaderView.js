const Config  = require('utils/config');
const Helpers = require('utils/helpers');
const App     = require('utils/sanaAppInstance');

let Procedure  = require('models/procedure');
let Page = require('models/page');

module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/builderHeaderView'),

    ui: {
        titleField: 'input#change-title',
        authorField: 'input#change-author',
        versionSelector: 'select#select-version',
        downloadButton: 'a#download-btn',
        saveButton: 'a#save-btn',
        saveVersionButton: 'a#save-version-btn',
    },

    events: {
        'keyup @ui.titleField': '_save',
        'keyup @ui.authorField': '_save',
        'click @ui.downloadButton': '_download',
        'click @ui.saveButton':  '_saveProcedure',
        'click @ui.saveVersionButton': '_saveNewProcedureVersion',
    },

    modelEvents: {
        'change:title': '_renderOnce',
        'change:author': '_renderOnce',
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
        const nextVersion = this.model.get('version') + 1;
        let procedure = new Procedure({
            uuid: this.model.get('uuid'),
            version: nextVersion,
            title: this.model.get('title'),
            author: this.model.get('author'),
            owner: this.model.get('owner'),
        });

        procedure.save({}, {
            success: function() {
                console.info('Created new version for procedure', procedure.id);

                // TODO, update the current procedure view to this new version.
            },
            error: function() {
                console.warn('Failed to create Procedure!');
                App().RootView.showNotification('Failed to create Procedure!');
            },
        });

        // Save the new copies of pages
        this.model.pages.forEach(function(page) {
            let copyPage = new Page({
                display_index: page.get('display_index'),
                procedure: procedure.get('id'),
                elements: page.get('elements'),
                show_if: page.get('show_if'),
            });

            page.save({}, {
                success: function success() {
                    console.info('Created Page', page.get('id'));
                    procedure.pages.add(copyPage);
                },
                error: function error() {
                    console.warn('Failed to create Page', page.get('id'));
                    App().RootView.showNotification('Failed to create Page!');
                }
            });
        });
    },

    _renderOnce: _.once(function() {
        this.render();
    }),

    _saveToServer: function() {
        this.model.save({
            title: this.ui.titleField.val(),
            author: this.ui.authorField.val(),
        }, {
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

});

const Config  = require('utils/config');
const Helpers = require('utils/helpers');
const App     = require('utils/sanaAppInstance');


module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/builderHeaderView'),

    ui: {
        titleField: 'input#change-title',
        authorField: 'input#change-author',
        downloadButton: 'a#download-btn',
    },

    events: {
        'keyup @ui.titleField': '_save',
        'keyup @ui.authorField': '_save',
        'click @ui.downloadButton': '_download'
    },

    _save: function() {
        // Wait until input is finished before saving to server to avoid sending too many requests
        if (this._timerId !== undefined) {
            clearTimeout(this._timerId);
            this._timerId = undefined;
        }

        let self = this;
        this._timerId = setTimeout(function() {
            self._saveToServer();
        }, Config.INPUT_DELAY_BEFORE_SAVE);
    },

    _saveToServer: function() {
        this.model.save({
            title: this.ui.titleField.val(),
            author: this.ui.authorField.val(),
        }, {
            error: function(model, response, options) {
                console.warn('Failed to save Procedure meta data:', response.responseJSON);
                App().showNotification('danger', 'Failed save title and author!');
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

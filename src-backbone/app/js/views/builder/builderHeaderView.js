module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/builderHeaderView'),

    ui: {
        titleField: 'input#change-title',
        authorField: 'input#change-author',
    },

    events: {
        'keyup @ui.titleField': 'save',
        'keyup @ui.authorField': 'save',
    },

    save: function() {
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
                // TODO also show alert
            },
        });
    },

});

module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures_builder/header'),

    ui: {
        title_field: 'input#change-title',
        author_field: 'input#change-author',
    },

    events: {
        'keyup @ui.title_field': 'save',
        'keyup @ui.author_field': 'save',
    },

    save: function() {
        let self = this;
        let save_to_server = function() {
            self.model.save({
                title: self.ui.title_field.val(),
                author: self.ui.author_field.val(),
            }, {
                error: function(model, response, options) {
                    console.warn('Failed to save Procedure meta data:', response.responseJSON);
                    // TODO also show alert
                },
            });
        };

        // Wait until input is finished before saving to server to avoid sending too many requests
        if (this._timer_id !== undefined) {
            clearTimeout(this._timer_id);
            this._timer_id = undefined;
        }
        this._timer_id = setTimeout(save_to_server, Config.INPUT_DELAY_BEFORE_SAVE);
    },

});

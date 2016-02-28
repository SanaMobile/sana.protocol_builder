module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageElements/types/pluginEntryView'),

    ui: {
        'action': 'input.action',
    },

    events: {
        'keyup @ui.action': '_onPluginEntryFormChanged',
    },

    _onPluginEntryFormChanged: function(event) {
        let action = this.ui.action.val();

        this.model.debounceSave({
            action: action,
        });
    },

});

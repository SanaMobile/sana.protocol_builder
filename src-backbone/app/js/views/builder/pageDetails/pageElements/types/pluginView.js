module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageDetails/pageElements/types/pluginView'),

    ui: {
        'action': 'input.action',
        'mimeType': 'input.mime-type',
    },

    events: {
        'keyup @ui.action': '_onPluginFormChanged',
        'keyup @ui.mimeType': '_onPluginFormChanged',
    },

    _onPluginFormChanged: function(event) {
        let action = this.ui.action.val();
        let mimeType = this.ui.mimeType.val();

        this.model.debounceSave({
            action: action,
            mime_type: mimeType,
        });
    },

});

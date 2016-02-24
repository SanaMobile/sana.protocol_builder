module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/pageElements/types/pluginEntryView'),

    ui: {
        'action': 'input.action',
        'mimeType': 'input.mime-type',
    },

    triggers: {
        'keyup @ui.action': 'update_action',
        'keyup @ui.mimeType': 'update_mimeType',
    },
});

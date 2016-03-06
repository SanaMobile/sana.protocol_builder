let App = require('utils/sanaAppInstance');


module.exports = Marionette.ItemView.extend({
    template: require('templates/auth/settingsView'),

    ui: {
        form: 'form'
    },

    events: {
        'submit': 'onSubmit'
    },

    onSubmit: function(event) {
        event.preventDefault();

        let self = this;
        let $form = this.ui.form;

        App().session.user.updateInformation($form.serializeArray());
    },

});
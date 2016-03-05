const App = require('utils/sanaAppInstance');

module.exports = Marionette.LayoutView.extend({
    template: require('templates/concepts/conceptUploaderView'),

    ui: {
        form: 'form',
        file: '.btn-file :file'
    },

    events: {
        'submit @ui.form': 'onSubmit',
    },

    onSubmit: function(event) {
        event.preventDefault();

        let self = this;
        let $form = this.ui.form;

        let data = new FormData();
        data.append('csv', _.first($('#file_uploader')[0].files));

        self.uploadCSV(data);
    },

    uploadCSV: function(data) {
        $.ajax({
            url: '/api/concepts/import_csv',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            beforeSend: function() {
                App().RootView.showSpinner();
            },
            complete: function() {
                App().RootView.hideSpinner();
            },
            success: function() {
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'Success!',
                    desc: 'CSV Imported Successfully',
                    alertType: 'success',
                });
            },
            error: function(errors) {
                App().RootView.clearNotifications();
                App().RootView.showNotification({
                    title: 'There was a problem',
                    desc: errors.responseJSON.errors
                });
            }
        });
    },
});

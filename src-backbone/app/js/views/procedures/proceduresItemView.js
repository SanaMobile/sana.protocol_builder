const App     = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');

module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/proceduresItemView'),
    tagName: 'li',
    className: 'procedure',

    events: {
        'click a.download': '_onDownloadProcedure',
        'click a.delete': '_onDeleteProcedure',
        'click a.push': '_onPushProcedure',
    },

    onRender: function() {
        this.$el.hide().fadeIn();
    },

    _onDownloadProcedure: function(event) {
        event.preventDefault();
        this.model.generate();
    },

    _onDeleteProcedure: function(event) {
        event.preventDefault();

        // TODO prompt user for confirmation

        let self = this;
        let el = this.$el;

        el.fadeOut(function() {
            self.model.destroy({
                success: function(model, response, options) {
                    console.info('Deleted Procedure', self.model.get('id'));
                },
                error: function(model, response, options) {
                    console.warn('Failed to delete Procedure', self.model.get('id'), response.responseJSON);
                    App().RootView.showNotification('Failed to delete Procedure!');
                    el.fadeIn();
                },
            });
        });
    },

    _onPushProcedure: function(event) {
        event.preventDefault();
        let self = this;
        let id = self.model.get('id');

        // Call the django api
        $.ajax({
            type: 'POST',
            url: '/api/procedures/push_to_devices',
            data: {
                'id': id,
            },
            dataType: "text",
            success: function onGenerateSuccess(data, status, jqXHR) {
                App().RootView.showNotification({
                    title: i18n.t('Success!'),
                    desc: i18n.t('Pushed procedure ', {id: id}),
                    alertType: 'success',
                });
            },
            error: function onGenerateError(jqXHR, textStatus, errorThrown) {
                console.warn('Failed to push procedure ' + id, textStatus);
                App().RootView.showNotification({
                    title: i18n.t('Failed to push procedure ', {id: id}),
                    desc: jqXHR.responseText,
                });
            },
        });
    },

});

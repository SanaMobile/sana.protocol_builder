const App     = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');


module.exports = Marionette.ItemView.extend({

    template: require('templates/procedures/proceduresItemView'),
    tagName: 'li',
    className: 'procedure',

    events: {
        'click a.download': '_onDownloadProcedure',
        'click a.delete': '_onDeleteProcedure',
    },

    onRender: function() {
        this.$el.hide().fadeIn();
    },

    _onDownloadProcedure: function(event) {
        event.preventDefault();
        let title = this.model.get('title');
        this.model.generate(
            function onGenerateSuccess(data, status, jqXHR) {
                const filename = title + '.xml';
                Helpers.downloadXMLFile(data, filename);
            },
            function onGenerateError(jqXHR, textStatus, errorThrown) {
                console.warn('Failed to generate Procedure', textStatus);
                App().RootView.showNotification({
                    title: i18n.t('Failed to generate Procedure'),
                    desc: i18n.t(jqXHR.responseText),
                }, {
                    isTranslated: true
                });
            });
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

});

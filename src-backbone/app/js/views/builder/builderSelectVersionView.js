const App     = require('utils/sanaAppInstance');
const Helpers = require('utils/helpers');


module.exports = Marionette.ItemView.extend({

    template: require('templates/builder/builderSelectVersionView'),
    tagName: 'option',
    className: 'procedure',

    // value: model.id,

    ui: {
        versionSelector: 'select#builder-select-version-view',
    },

    value: 5,

    events: {
        'change @ui.versionSelector': '_selectMyVersion',
    },

    initialize: function(options){
        this.selectedVersion = options.selectedVersion;
    },

    onRender: function() {
        this.$el.show();
        this.$el.val(this.model.get('id'));
        if (this.selectedVersion == this.model.get('id')) {
            this.$el.attr("selected", "selected");
        }
    },

    // _onDownloadProcedure: function(event) {
    //     event.preventDefault();
    //     this.model.generate();
    // },

    // _onDeleteProcedure: function(event) {
    //     event.preventDefault();

    //     // TODO prompt user for confirmation

    //     let self = this;
    //     let el = this.$el;

    //     el.fadeOut(function() {
    //         self.model.destroy({
    //             success: function(model, response, options) {
    //                 console.info('Deleted Procedure', self.model.get('id'));
    //             },
    //             error: function(model, response, options) {
    //                 console.warn('Failed to delete Procedure', self.model.get('id'), response.responseJSON);
    //                 App().RootView.showNotification('Failed to delete Procedure!');
    //                 el.fadeIn();
    //             },
    //         });
    //     });
    // },

    _selectMyVersion: function(event) {
        console.log("i cry");
    },

});

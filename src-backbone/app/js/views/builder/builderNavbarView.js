const App = require('utils/sanaAppInstance');
const EventKeys = require('utils/eventKeys');
const Helpers = require('utils/helpers');


module.exports = Marionette.LayoutView.extend({

    template: require('templates/builder/builderNavbarView'),
    tagName: 'div',
    className: 'container-fluid spb-container',

    regions: {
        'languageSelector': 'div.navbar-right.language-selector',
        'rightNavbar': 'div.navbar-right.content',
    },

    behaviors: {
        RightNavbarBehavior: {},
    },

    //-------------------------------------------------------------------------
    // File menu
    //-------------------------------------------------------------------------

    events: {
        'click #menu-bar ul.file a.save'  : '_onFileSave',
        'click #menu-bar ul.file a.delete': '_onFileDelete',
    },

    _onFileSave: function() {
        this.model.save();
    },

    _onFileDelete: function() {
        // TODO prompt user for confirmation

        let self = this;
        this.model.destroy({
            success: function() {
                console.info('Deleted Procedure', self.model.get('id'));
                Helpers.navigateToDefaultLoggedIn();
            },
            error: function() {
                console.warn('Failed to delete Procedure', self.model.get('id'));
                App().RootView.showNotification('Failed delete Procedure!');
            },
        });
    },

    //-------------------------------------------------------------------------
    // Model events
    //-------------------------------------------------------------------------

    initialize: function() {
        this.listenTo(this.model, 'request', this.saving); // Whenenever an AJAX call is made
        this.listenTo(this.model, 'sync', this.saved); // After server responds
        this.listenTo(this.model, 'destroy', this.saved); // After server responds
        this.listenTo(this.model, 'error', this.error); // After server responds with error
    },

    saving: function (event) {
        this.triggerMethod(EventKeys.UPDATE_NAVBAR_TEXT, i18n.t('Saving...'));
    },

    saved: function(event) {
        this.triggerMethod(EventKeys.UPDATE_NAVBAR_TEXT, i18n.t('All changes saved to server.'));
    },

    error: function(event) {
        this.triggerMethod(EventKeys.UPDATE_NAVBAR_TEXT, i18n.t('Failed to synchronize with server.'));
    },

});

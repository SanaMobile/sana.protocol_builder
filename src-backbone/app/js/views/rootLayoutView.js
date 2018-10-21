const ModalRegion = require('views/builder/pageDetails/pageElements/modalRegion');
const Notifications = require('collections/notifications');
const NotificationsCollectionView = require('views/notifications/notificationsCollectionView');

const EventKeys = require('utils/eventKeys');
const Helpers = require('utils/helpers');
const Config = require('utils/config');
const App = require('utils/sanaAppInstance');


module.exports = Marionette.LayoutView.extend({

    el: 'body',

    template: require('templates/rootLayoutView'),

    regions: {
        'navbar': 'nav#navbar div#navbar-content',
        'modal': {
            selector: 'div#modal',
            regionClass: ModalRegion
        },
        'notificationCenter': 'div#notification-center',
        'main': 'div#main',
    },

    events: {
        'click nav#navbar a.go-back': '_onClickGoBack',
    },

    childEvents: function() {
        let eventsHash = {};
        eventsHash[EventKeys.UPDATE_NAVBAR_TEXT] = this._onUpdateNavbarText;
        return eventsHash;
    },

    constructor: function(options) {
        this._notifications = new Notifications();
        Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function() {
        this.showChildView('notificationCenter', new NotificationsCollectionView({
            collection: this._notifications,
        }));
    },

    //--------------------------------------------------------------------------
    // Public methods
    //--------------------------------------------------------------------------

    showSpinner: function() {
        let $spinner = $('<div class="spinner" />').hide();
        $spinner.appendTo(this.$el).fadeIn('fast');
    },

    hideSpinner: function() {
        let $spinner = this.$el.find('.spinner');
        $spinner.fadeOut('fast', function() {
            $spinner.remove();
        });
    },

    switchMainView: function(view, bodyClass = null) {
        if (Config.DEBUG) {
            global.ActiveMainView = view;
        }

        this.$el.removeClass().addClass(bodyClass);
        this.showChildView('main', view);
    },

    switchNavbar: function(navbarView) {
        if (!navbarView) {
            navbarView = new Marionette.ItemView({
                template: '<div></div>',
                tagName: 'div',
                className: 'container-fluid spb-container',
            });
        }

        this.showChildView('navbar', navbarView);
    },

    clearNotifications: function() {
        this._notifications.reset();
    },

    showModal: function(view, str) {
        this.modal.show(view);
    },

    hideModal: function() {
        this.modal.hide();
    },

    showNotification: function(attributes, isTranslated = false) {
        if (typeof attributes === 'string') {
            attributes = { title: attributes };
        }

        this._notifications.push(attributes, { isTranslated: isTranslated });
    },

    //--------------------------------------------------------------------------
    // Event listeners
    //--------------------------------------------------------------------------

    _onClickGoBack: function() {
        if (App().session.isValid()) {
            Helpers.navigateToDefaultLoggedIn();
        } else {
            Helpers.navigateToDefaultLoggedOut();
        }
    },

    _onUpdateNavbarText: function(childView, text) {
        this.$el.find('p.navbar-text').text(text);
    },

});

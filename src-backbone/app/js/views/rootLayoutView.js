const Notifications = require('collections/notifications');
const NotificationsCollectionView = require('views/notifications/notificationsCollectionView');

const EventKeys = require('utils/eventKeys');
const Helpers = require('utils/helpers');
const App = require('utils/sanaAppInstance');


module.exports = Marionette.LayoutView.extend({
  
    el: 'body',

    template: require('templates/rootLayoutView'),

    regions: {
        'navbar': 'nav#navbar div#navbar-content',
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

    clearNotifications: function() {
        this._notifications.reset();
    },

    showNotification: function(alertType, title, desc, timeout) {
        this._notifications.add([
            {
                alertType: alertType,
                title: title,
                desc: desc,
                timeout: timeout,
            }
        ]);
    },

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

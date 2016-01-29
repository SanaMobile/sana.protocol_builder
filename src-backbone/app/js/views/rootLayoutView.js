const Notifications = require('collections/notifications');
const NotificationsCollectionView = require('views/notifications/notificationsCollectionView');


module.exports = Marionette.LayoutView.extend({
  
    el: 'body',

    template: require('templates/rootLayoutView'),

    regions: {
        'navbar': 'nav#navbar',
        'notificationCenter': 'div#notification-center',
        'main': 'div#main',
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

});

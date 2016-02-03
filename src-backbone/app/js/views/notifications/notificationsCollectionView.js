const NotificationView = require('./notificationItemView');
const Helpers = require('utils/helpers');


module.exports = Marionette.CollectionView.extend({

    childView: NotificationView,

    tagName: 'ul',

    onAddChild: function(notificationView) {
        const timeout = notificationView.model.get('timeout');
        if (timeout > 0) {
            setTimeout(function() {
                notificationView.onClose(Helpers.createDummyEvent());
            }, timeout * 1000);
        }
    },

});

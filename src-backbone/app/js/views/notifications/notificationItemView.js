const Helpers = require('utils/helpers');


module.exports = Marionette.ItemView.extend({

    template: require('templates/notifications/notificationItemView'),
    tagName: 'li',

    events: {
        'click a.close': 'onClose',
    },

    onClose: function (event) {
        event.preventDefault();

        let self = this;
        this.$el.slideUp(function() {
            self.model.destroy();
        });
    },

});

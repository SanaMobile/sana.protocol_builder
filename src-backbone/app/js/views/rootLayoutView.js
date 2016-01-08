module.exports = Marionette.LayoutView.extend({
  
    el: 'body',

    regions: {
        main: '#main'
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

module.exports = Marionette.LayoutView.extend({
  
    el: 'body',

    regions: {
        main: '#main'
    },

    show_spinner: function() {
        var $spinner = $('<div class="spinner" />').hide();
        $spinner.appendTo(this.$el).fadeIn('fast');
    },

    hide_spinner: function() {
        var $spinner = this.$el.find('.spinner');
        $spinner.fadeOut('fast', function() {
            $spinner.remove();
        });
    },

});

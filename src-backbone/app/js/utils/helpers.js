module.exports = {

    goto_default_logged_in: function() {
        Backbone.history.navigate('procedures', {
            trigger: true,
            replace: true,
        });
    },

    goto_default_logged_out: function() {
        Backbone.history.navigate('login', {
            trigger: true,
            replace: true,
        });
    },

    current_page_require_authentication: function() {
        var nonauth_pages = Config.NON_AUTH_PAGES;

        for (var i = nonauth_pages.length - 1; i >= 0; i--) {
            if (Backbone.history.fragment.substr(0, nonauth_pages[i].length) === nonauth_pages[i]) {
                return false;
            }
        }

        return true;
    },

    create_alert_html: function(message, type) {
        var html =
            '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                message +
            '</div>';

        return html;
    },

    arrived_on_page: function(title) {
        document.title = title + " | " + Config.SITE_TITLE;
        console.info('View: ' + title);
    },

};

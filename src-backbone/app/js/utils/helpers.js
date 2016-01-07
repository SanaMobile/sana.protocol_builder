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
        console.info('%cView: ' + title, 'background:Green; color:White');
    },

    propagate_events: function(src, dest, events_to_propagate) {
        var create_event_handler = function(event) {
            return function() {
                dest.trigger(event);
            };
        };

        for (let event of events_to_propagate) {
            src.on(event, create_event_handler(event));
        }
    },

    sluggify: function(str) {
        return str && str
            .toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '')             // Trim - from end of text
        ;
    },

};

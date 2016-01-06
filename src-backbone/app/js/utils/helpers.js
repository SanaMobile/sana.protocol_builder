module.exports = {

    navigateToDefaultLoggedIn: function() {
        Backbone.history.navigate('procedures', {
            trigger: true,
            replace: true,
        });
    },

    navigateToDefaultLoggedOut: function() {
        Backbone.history.navigate('login', {
            trigger: true,
            replace: true,
        });
    },

    currentPageRequiresAuth: function() {
        let nonAuthPages = Config.NON_AUTH_PAGES;

        for (let i = nonAuthPages.length - 1; i >= 0; i--) {
            if (Backbone.history.fragment.substr(0, nonAuthPages[i].length) === nonAuthPages[i]) {
                return false;
            }
        }

        return true;
    },

    createAlertHTML: function(message, type) {
        let html =
            '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                message +
            '</div>';

        return html;
    },

    arrivedOnView: function(title) {
        document.title = title + " | " + Config.SITE_TITLE;
        console.info('%cView: ' + title, 'background:Green; color:White');
    },

    propagateEvents: function(src, dest, eventsToPropagate) {
        let createEventHandler = function(event) {
            return function() {
                dest.trigger(event);
            };
        };

        for (let event of eventsToPropagate) {
            src.on(event, createEventHandler(event));
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

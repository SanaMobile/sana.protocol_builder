const Config = require('utils/config');


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
        const nonAuthPages = Config.NON_AUTH_PAGES;
        const currentURL = Backbone.history.fragment;

        for (let i = nonAuthPages.length - 1; i >= 0; i--) {
            if (currentURL.substr(0, nonAuthPages[i].length) === nonAuthPages[i]) {
                return false;
            }
        }

        return true;
    },

    createDummyEvent: function() {
        return {
            preventDefault: function() {
                // nop
            },
        };
    },

    arrivedOnView: function(title) {
        document.title = i18n.t(title) + " | " + Config.SITE_TITLE;
        console.info('%cView: ' + title, 'background:Green; color:White');
    },

    propagateEvents: function(src, dest, eventsToPropagate = ['request', 'sync', 'error']) {
        let createEventHandler = function(event) {
            return function() {
                let args = [event];
                for (let arg of arguments) {
                    args.push(arg);
                }

                dest.trigger.apply(dest, args);
            };
        };

        for (let event of eventsToPropagate) {
            src.on(event, createEventHandler(event));
        }
    },

    sluggify: function(str) {
        return str && str
            .toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with '-'
            .replace(/_/g, '-')             // Replace underscores with '-'
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple '-' with single '-'
            .replace(/^-+/, '')             // Trim '-' from start of text
            .replace(/-+$/, '')             // Trim '-' from end of text
        ;
    },

    downloadXMLFile: function(domDocument, filename) {
        let blob = new Blob([(new XMLSerializer()).serializeToString(domDocument)], { type: 'text/xml' });
        let href = global.URL.createObjectURL(blob);

        let element = document.createElement('a');
        element.setAttribute('href', href);
        element.setAttribute('download', filename);
        element.style.display = 'none';

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    isValidUrl: function(url) {
        const urlRegex = /(^(https?):\/\/\S+$)/;
        return urlRegex.test(url);
    },
};

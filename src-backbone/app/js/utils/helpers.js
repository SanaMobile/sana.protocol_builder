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
            .replace(/\s+/g, '-')           // Replace spaces with '-'
            .replace(/_/g, '-')             // Replace underscores with '-'
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple '-' with single '-'
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '')             // Trim - from end of text
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

    delaySave: function(context, callback) {
        // Wait until input is finished before saving to server to avoid sending too many requests
        if (typeof context._timerId !== 'undefined') {
            clearTimeout(context._timerId);
            context._timerId = undefined;
        }

        context._timerId = setTimeout(function() {
            callback.call(context);
        }, Config.INPUT_DELAY_BEFORE_SAVE);
    },

};

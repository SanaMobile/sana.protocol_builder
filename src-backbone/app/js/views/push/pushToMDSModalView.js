const Helpers = require('utils/helpers');
const ModalLayoutView = require('views/common/modalLayoutView');


module.exports = Marionette.LayoutView.extend({
    template: require('templates/push/pushToMDSModalView'),

    events: {
        'click a#submit-btn': '_onSubmit',
    },

    ui: {
        urlField: 'input#mds-url',
        usernameField: 'input#mds-username',
        passwordField: 'input#mds-password',
        errorMessageSpan: 'span#error-message',
    },

    templateHelpers: function() {
        return {
            headingText: this.headingText,
            url: this.url,
            username: this.username,
            password: this.password,
        };
    },

    initialize: function(options) {
        this.headingText = options.headingText;
        this.url = options.url;
        this.username = options.username;
        this.password = options.password;

        this.onSubmit = options.onSubmit;
    },

    _onSubmit: function() {
        const url = $.trim(this.ui.urlField.val());
        const username = $.trim(this.ui.usernameField.val());
        const password = this.ui.passwordField.val();

        if (!url || !username || !password) {
            const errorMessage = i18n.t('Please fill in all fields.');
            this.ui.errorMessageSpan.html(errorMessage);
        } else if (!Helpers.isValidUrl(url)) {
            const errorMessage = i18n.t('Your URL is in an invalid format. Make sure you include the http or https at the beginning (e.g. https://www.yourMdsUrl.com)');
            this.ui.errorMessageSpan.html(errorMessage);
        } else {
            this.ui.errorMessageSpan.empty();
            this.onSubmit(url, username, password);
        }
    },
});

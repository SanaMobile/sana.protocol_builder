module.exports = Marionette.LayoutView.extend({

    template: require('templates/common/rightNavbarView'),
    tagName: 'div',
    className: 'container-fluid spb-container',

    regions: {
        'languageSelector': 'div.navbar-right.language-selector',
        'rightNavbar': 'div.navbar-right.content',
    },

    behaviors: {
        RightNavbarBehavior: {},
    },

});

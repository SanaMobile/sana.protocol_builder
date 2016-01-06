module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/auth/authLayoutView'),

    regions: {
        authFormArea: '#auth-form-area'
    }

});

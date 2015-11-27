module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/auth/auth_layout'),

    regions: {
        auth_form_area: '#auth-form-area'
    }

});

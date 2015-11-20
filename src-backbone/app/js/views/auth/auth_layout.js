module.exports = Marionette.LayoutView.extend({
  
    template: require('templates/auth/auth_layout'),

    regions: {
        form_area: '#auth-form'
    }

});

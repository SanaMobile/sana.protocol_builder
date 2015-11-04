module.exports = Marionette.LayoutView.extend({
  
    template: Handlebars.templates.auth_layout,

    regions: {
        form_area: '#auth-form'
    }

});

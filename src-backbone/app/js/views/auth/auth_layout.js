module.exports = Marionette.LayoutView.extend({
  
    template: Handlebars.templates.auth,

    regions: {
        form_area: '#auth-form'
    }

});

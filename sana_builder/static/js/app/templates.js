define(['ember', 'SanaBuilder',
    'text!templates/procedureListing.hbs',
    'text!templates/settings.hbs'
],
function (Ember, SanaBuilder,
    procedureListing,
    settings
) {
    Ember.TEMPLATES['procedureListing'] = Ember.Handlebars.compile(procedureListing);
    Ember.TEMPLATES['settings'] = Ember.Handlebars.compile(settings);
});

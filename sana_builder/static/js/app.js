requirejs.config({
    baseUrl: '/static/js/libs',
    paths: {
        'app': '/static/js/app',
        'jquery': 'jquery-v1.10.2',
        'ember': 'ember-v1.8.0',
        'handlebars': 'handlebars-v1.3.0',
        'bootstrap': 'bootstrap-v3.3.0',
    },
    shim: {
        'ember': {
            'deps': ['handlebars'],
            'export': 'ember',
        },
        'handlebars': {
            'export': 'handlebars',
        },
        'bootstrap': {
            'deps': ['jquery'],
        },
    },
});

requirejs(['app/main']);

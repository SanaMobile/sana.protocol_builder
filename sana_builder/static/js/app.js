define(function() {
    requirejs.config({
        baseUrl: '/static/js/libs',
        paths: {
            'app'        : '/static/js/app',
            'jquery'     : 'jquery-v1.10.2',
            'ember'      : 'ember-v1.8.0',
            'handlebars' : 'handlebars-v1.3.0',
            'bootstrap'  : 'bootstrap-v3.3.0',
        },
        shim: {
            'ember': {
                'deps'   : ['handlebars'],
                'exports': 'Ember',
            },
            'handlebars': {
                'exports': 'Handlebars',
            },
            'bootstrap/affix':      { deps: ['jquery'], exports: 'jQuery.fn.affix'           },
            'bootstrap/alert':      { deps: ['jquery'], exports: 'jQuery.fn.alert'           },
            'bootstrap/button':     { deps: ['jquery'], exports: 'jQuery.fn.button'          },
            'bootstrap/carousel':   { deps: ['jquery'], exports: 'jQuery.fn.carousel'        },
            'bootstrap/collapse':   { deps: ['jquery'], exports: 'jQuery.fn.collapse'        },
            'bootstrap/dropdown':   { deps: ['jquery'], exports: 'jQuery.fn.dropdown'        },
            'bootstrap/modal':      { deps: ['jquery'], exports: 'jQuery.fn.modal'           },
            'bootstrap/popover':    { deps: ['jquery'], exports: 'jQuery.fn.popover'         },
            'bootstrap/scrollspy':  { deps: ['jquery'], exports: 'jQuery.fn.scrollspy'       },
            'bootstrap/tab':        { deps: ['jquery'], exports: 'jQuery.fn.tab'             },
            'bootstrap/tooltip':    { deps: ['jquery'], exports: 'jQuery.fn.tooltip'         },
            'bootstrap/transition': { deps: ['jquery'], exports: 'jQuery.support.transition' },
        },
        enforceDefine: true,
    });

    requirejs(['app/main']);
});

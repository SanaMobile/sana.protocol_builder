define(function () {
    requirejs.config({
        baseUrl: '/static/js/app',
        paths: {
            'jquery'     : '../libs/jquery-v1.10.2',
            'ember'      : '../libs/ember-v1.8.0',
            'handlebars' : '../libs/handlebars-v1.3.0',
            'bootstrap'  : '../libs/bootstrap-v3.3.0',
            'text'       : '../libs/requiretext-v2.0.12',
        },
        shim: {
            'ember': {
                'deps'   : ['jquery', 'handlebars'],
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

    // Every page on this website needs these 3 modules
    require(['jquery', 'bootstrap/transition', 'bootstrap/collapse']);
});

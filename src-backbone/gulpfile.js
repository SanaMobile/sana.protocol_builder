'use strict';

//------------------------------------------------------------------------------
// Config
//------------------------------------------------------------------------------

var gulp = require('gulp');
var debug = false;

var Config = {
    main_app: [
        'app/js/main.coffee',
    ],
    javascripts: [
        'app/js/**/*.js',
    ],
    coffeescripts: [
        'app/js/**/*.coffee',
    ],
    handlebars: [
        'app/js/**/*.hbs',
    ],
    stylesheets: [
        'app/css/**/*.less', // Since LESS is a superset of CSS, the preprocessor shouldn't affect regular CSS files
        'app/css/**/*.css',
    ],
    images: [
        'app/img/**/*'
    ],
    html: [
        'app/index.html'
    ],
    bower_components: 'bower_components/**',
    output: 'dist'
};

//------------------------------------------------------------------------------
// Webserver
//------------------------------------------------------------------------------

var connect = require('gulp-connect');
gulp.task('webserver', function() {
    connect.server({
        livereload: true,
        root: [ Config.output ],
        fallback: Config.output + '/index.html'
    });
});

//------------------------------------------------------------------------------
// CSS Tasks
//------------------------------------------------------------------------------

var less = require('gulp-less');
var path = require('path');
var minify_css = require('gulp-minify-css');
var source_maps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('css', function() {
    gulp.src(Config.stylesheets)
        .pipe(gulpif(debug, source_maps.init()))
        .pipe(less({
            paths: [
                path.join(__dirname, 'app/css'),
                path.join(__dirname, 'bower_components'),
            ]
        }))
        .pipe(concat('app.css'))
        .pipe(minify_css())
        .pipe(gulpif(debug, source_maps.write()))
        .pipe(gulp.dest(Config.output + '/css'))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// JS Tasks
//------------------------------------------------------------------------------

var jshint = require('gulp-jshint'); // Note: we're using JSHint, a better fork of the original JSLint
var stylish = require('jshint-stylish');

gulp.task('js-lint', function() {
    gulp.src(Config.javascripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

var coffeelint = require('gulp-coffeelint');

gulp.task('cs-lint', function() {
    gulp.src(Config.coffeescripts)
        .pipe(coffeelint())
        .pipe(coffeelint.reporter());
});

var coffeeify = require('gulp-coffeeify');
var rename = require("gulp-rename");

gulp.task('js-coffee', function() {
    gulp.src(Config.main_app)
        .pipe(coffeeify({
            options: {
                debug: true, // Generate source map 
                paths: [ __dirname + '/app/js' ]
            }
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest(Config.output + '/js'))
        .pipe(connect.reload());
});

gulp.task('js', ['js-lint', 'cs-lint', 'js-coffee']);

//------------------------------------------------------------------------------
// Handlebars Tasks
//------------------------------------------------------------------------------

var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');

gulp.task('hbs', function() {
    gulp.src(Config.handlebars)
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('(function() { var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {}; templates[\'<%= getName(file.relative) %>\'] = template(<%= contents %>);})();', {}, {
            imports: {
                getName: function(filename) {
                    var path = require('path');
                    return path.basename(filename, path.extname(filename));
                }
            }
        }))
        .pipe(declare({
            namespace: 'Sana.templates',
            noRedeclare: true, // Avoid duplicate declarations 
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(Config.output + '/js'))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// Image Tasks
//------------------------------------------------------------------------------

gulp.task('img', function() {
    gulp.src(Config.images)
        .pipe(gulp.dest(Config.output + '/img'))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// HTML Tasks
//------------------------------------------------------------------------------

gulp.task('html', function() {
    gulp.src(Config.html)
        .pipe(gulp.dest(Config.output))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// Bower Tasks
//------------------------------------------------------------------------------

var main_bower_files = require('main-bower-files');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');

var bower_files = main_bower_files({
    overrides: {
        bootstrap: {
            main: [
                './dist/js/bootstrap.js',
                './dist/css/*.min.*',
                './dist/fonts/*.*'
            ]
        }
    }
});

gulp.task('bower-js', function() {
    var js_filter = filter('**/*.js');

    gulp.src(bower_files, { base: 'bower_components' })
        .pipe(js_filter)
        .pipe(concat('libs.js'))
        .pipe(gulpif(!debug, uglify()))
        .pipe(gulp.dest(Config.output + '/js'))
        .pipe(connect.reload());
});

gulp.task('bower-css', function() {
    var css_filter = filter('**/*.css');

    gulp.src(bower_files, { base: 'bower_components' })
        .pipe(css_filter)
        .pipe(concat('libs.css'))
        .pipe(gulp.dest(Config.output + '/css'))
        .pipe(connect.reload());
});

gulp.task('bower-fonts', function() {
    var font_filter = filter('**/dist/fonts/*.*');

    gulp.src(bower_files, { base: 'bower_components' })
        .pipe(font_filter)
        .pipe(flatten())
        .pipe(gulp.dest(Config.output + '/fonts'))
        .pipe(connect.reload());
});

gulp.task('bower', ['bower-js', 'bower-css', 'bower-fonts']);

//------------------------------------------------------------------------------
// Default
// This executes when you run 'gulp' on the command line
//------------------------------------------------------------------------------

gulp.task('default', ['css', 'js', 'hbs', 'bower', 'img', 'html'], function(){
    gulp.watch(Config.stylesheets, ['css']);
    gulp.watch([Config.javascripts, Config.coffeescripts], ['js']);
    gulp.watch(Config.handlebars, ['hbs']);
    gulp.watch(Config.bower_components, ['bower']);
    gulp.watch(Config.images, ['img']);
    gulp.watch(Config.html, ['html']);

    gulp.start('webserver');
});

//------------------------------------------------------------------------------
// Debug
//------------------------------------------------------------------------------

gulp.task('set-debug', function(){
    debug = true;
})

gulp.task('debug', ['set-debug'], function(){
    gulp.start('default');
})

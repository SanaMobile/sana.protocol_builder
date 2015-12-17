'use strict';

//------------------------------------------------------------------------------
// Config
//------------------------------------------------------------------------------

var gulp = require('gulp');

var Config = {
    DEBUG: false,
    entry_file: [
        'app/js/main.js',
    ],
    javascripts: [
        'tests/**/*.js',
        'app/js/**/*.js',
        'app/js/**/*.hbs',
    ],
    stylesheets: [
        'app/css/**/*.less', // Since LESS is a superset of CSS, the preprocessor shouldn't affect regular CSS files
        'app/css/**/*.css',
    ],
    images: [
        'app/img/**/*',
    ],
    fonts: [
        'node_modules/bootstrap/fonts/**/*',
    ],
    html: [
        'app/index.html',
    ],
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

gulp.task('css', function() {
    var gulpif = require('gulp-if');
    var less = require('gulp-less');
    var path = require('path');
    var minify_css = require('gulp-minify-css');
    var source_maps = require('gulp-sourcemaps');
    var concat = require('gulp-concat');

    gulp.src(Config.stylesheets)
    
        .pipe(gulpif(Config.DEBUG, source_maps.init({ loadMaps: true })))
            .pipe(less({
                paths: [
                    path.join(__dirname, 'app/css'),
                ]
            }))
            .pipe(concat('app.css'))
            .pipe(minify_css())
        .pipe(gulpif(Config.DEBUG, source_maps.write({ sourceRoot: '/map-css' })))

        .pipe(gulp.dest(Config.output + '/css'))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// JS Tasks
//------------------------------------------------------------------------------

gulp.task('js-lint', function() {
    var jshint = require('gulp-jshint'); // Note: we're using JSHint, a better fork of the original JSLint
    var stylish = require('jshint-stylish');
    var filter = require('gulp-filter');

    var js_filter = filter('**/*.js');

    gulp.src(Config.javascripts)
        .pipe(js_filter)
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter(stylish));
});

gulp.task('js-browserify', function() {
    var gulpif = require('gulp-if');
    var browserify = require('browserify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var uglify = require('gulp-uglify');
    var gulp_util = require('gulp-util');
    var source_maps = require('gulp-sourcemaps');
    var stripDebug = require('gulp-strip-debug');

    var js_files = browserify({
        entries: Config.entry_file,
        debug: Config.DEBUG,
        paths: [ __dirname + '/app/js' ],
        extensions: ['.hbs'],
    });

    js_files.transform("babelify", {
        presets: [
            'es2015'
        ]
    });

    js_files.transform(require('hbsfy').configure({
        extensions: ['hbs']
    }));

    js_files.bundle()
        .on('error', gulp_util.log)
        .pipe(source('app.js')) // Treats stream as a single dummy file
        .pipe(buffer()) // Buffers stream into single file
        .pipe(gulpif(!Config.DEBUG, stripDebug()))
        
        .pipe(gulpif(Config.DEBUG, source_maps.init({ loadMaps: true })))
            .pipe(gulpif(!Config.DEBUG, uglify()))
        .pipe(gulpif(Config.DEBUG, source_maps.write({ sourceRoot: '/map-js' })))

        .pipe(gulp.dest(Config.output + '/js'))
        .pipe(connect.reload());
});

gulp.task('js', ['js-lint', 'js-browserify']);

//------------------------------------------------------------------------------
// Image Tasks
//------------------------------------------------------------------------------

gulp.task('img', function() {
    gulp.src(Config.images)
        .pipe(gulp.dest(Config.output + '/img'))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// Font Tasks
//------------------------------------------------------------------------------

gulp.task('fonts', function() {
    gulp.src(Config.fonts)
        .pipe(gulp.dest(Config.output + '/fonts'))
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
// Default
// This executes when you run 'gulp' on the command line
//------------------------------------------------------------------------------

gulp.task('build', ['css', 'js', 'img', 'fonts', 'html']);

gulp.task('default', ['build'], function(){
    gulp.watch(Config.stylesheets, ['css']);
    gulp.watch(Config.javascripts, ['js']);
    gulp.watch(Config.images, ['img']);
    gulp.watch(Config.fonts, ['fonts']);
    gulp.watch(Config.html, ['html']);

    gulp.start('webserver');
});

//------------------------------------------------------------------------------
// Debug
//------------------------------------------------------------------------------

gulp.task('set-debug', function(){
    var colors = require('colors');
    console.log('Gulp Debug Mode'.yellow.bgBlack);

    Config.DEBUG = true;
})

gulp.task('debug', ['set-debug'], function(){
    gulp.start('default');
})

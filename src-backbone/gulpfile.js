'use strict';

require('babel-core/register');

//------------------------------------------------------------------------------
// Config
//------------------------------------------------------------------------------

let gulp = require('gulp');

let Config = {
    DEBUG: false,
    entryFile: 'app/js/main.js',
    output: 'dist',

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
};

//------------------------------------------------------------------------------
// Webserver
//------------------------------------------------------------------------------

let connect = require('gulp-connect');

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
    let gulpif = require('gulp-if');
    let less = require('gulp-less');
    let path = require('path');
    let cssnano = require('gulp-cssnano');
    let sourceMaps = require('gulp-sourcemaps');
    let concat = require('gulp-concat');

    gulp.src(Config.stylesheets)
        .pipe(gulpif(Config.DEBUG, sourceMaps.init({ loadMaps: true })))
            .pipe(less({
                paths: [
                    path.join(__dirname, 'app/css'),
                ]
            }))
            .pipe(concat('app.css'))
            .pipe(cssnano())
        .pipe(gulpif(Config.DEBUG, sourceMaps.write({ sourceRoot: '/map-css' })))

        .pipe(gulp.dest(Config.output + '/css'))
        .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// JS Tasks
//------------------------------------------------------------------------------

gulp.task('js-lint', function() {
    let jshint = require('gulp-jshint'); // Note: we're using JSHint, a better fork of the original JSLint
    let stylish = require('jshint-stylish');
    let filter = require('gulp-filter');

    gulp.src(Config.javascripts)
        .pipe(filter('**/*.js'))
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter(stylish));
});

gulp.task('js-browserify', ['js-lint'], function() {
    let gulpif = require('gulp-if');
    let browserify = require('browserify');
    let source = require('vinyl-source-stream');
    let buffer = require('vinyl-buffer');
    let uglify = require('gulp-uglify');
    let gulpUtil = require('gulp-util');
    let sourceMaps = require('gulp-sourcemaps');
    let stripDebug = require('gulp-strip-debug');

    let jsFiles = browserify({
        entries: Config.entryFile,
        debug: Config.DEBUG,
        paths: [ __dirname + '/app/js' ],
        extensions: ['.hbs'],
    });

    jsFiles.transform("babelify", {
        presets: [
            'es2015'
        ]
    });

    jsFiles.transform(require('hbsfy').configure({
        extensions: ['hbs']
    }));

    jsFiles.bundle()
        .on('error', gulpUtil.log)
        .pipe(source('app.js')) // Treats stream as a single dummy file
        .pipe(buffer()) // Buffers stream into single file

        // Strip console.logs
        .pipe(gulpif(!Config.DEBUG, stripDebug()))
        
        // Compress files
        .pipe(gulpif(Config.DEBUG, sourceMaps.init({ loadMaps: true })))
            .pipe(gulpif(!Config.DEBUG, uglify()))
        .pipe(gulpif(Config.DEBUG, sourceMaps.write({ sourceRoot: '/map-js' })))

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
// Runner (default)
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

// Debug

gulp.task('set-debug', function(){
    let colors = require('colors');
    console.log('Gulp Debug Mode'.yellow.bgBlack);

    Config.DEBUG = true;
})

gulp.task('debug', ['set-debug'], function(){
    gulp.start('default');
})

//------------------------------------------------------------------------------
// Test
//------------------------------------------------------------------------------

gulp.task('test', ['js-lint'], function() {
    let filter = require('gulp-filter');
    let mocha = require('gulp-mocha');
    let stripDebug = require('gulp-strip-debug');

    gulp.src(Config.javascripts)
        .pipe(filter('**/**_test.js'))
        .pipe(mocha({
            require: [
                './tests/setup/globals',
            ],
        }));
});

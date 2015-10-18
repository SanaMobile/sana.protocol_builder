'use strict';

//------------------------------------------------------------------------------
// Config
//------------------------------------------------------------------------------

var gulp = require('gulp');
var debug = false;

var config = {
  main: 'app/js/main.coffee',
  javascripts: [
    'app/js/**/*.js',
  ],
  coffeescripts: [
    'app/js/**/*.coffee',
  ],
  handlebars: [
    'app/js/**/*.hbs',
  ],
  images: [
    'app/img/**/*'
  ],
  stylesheets: [
    'app/css/**/*.less', // Since LESS is a superset of CSS, the preprocessor shouldn't affect regular CSS files
    'app/css/**/*.css',
  ],
  bower: 'bower_components/**',
  output: 'app/assets'
};

//------------------------------------------------------------------------------
// Webserver
//------------------------------------------------------------------------------

var connect = require('gulp-connect');
gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: ['app'],
    fallback: 'app/index.html'
  });
});

//------------------------------------------------------------------------------
// CSS Tasks
//------------------------------------------------------------------------------

var less = require('gulp-less');
var minify_css = require('gulp-minify-css');
var source_maps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('css', function() {
  gulp.src(config.stylesheets)
    .pipe(source_maps.init())
    .pipe(less())
    .pipe(concat('app.css'))
    .pipe(minify_css())
    .pipe(source_maps.write())
    .pipe(gulp.dest(config.output))
    .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// Bower Tasks
//------------------------------------------------------------------------------

var main_bower_files = require('main-bower-files');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');

gulp.task('bower', function() {
  gulp.src(main_bower_files())
    .pipe(concat('libs.js'))
    .pipe(gulpif(!debug, uglify()))
    .pipe(gulp.dest(config.output));
});

//------------------------------------------------------------------------------
// JS Tasks
//------------------------------------------------------------------------------

var jshint = require('gulp-jshint'); // Note: we're using JSHint, a better fork of the original JSLint
var stylish = require('jshint-stylish');

gulp.task('js-lint', function() {
  gulp.src(config.javascripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

var coffeelint = require('gulp-coffeelint');

gulp.task('cs-lint', function() {
  gulp.src(config.coffeescripts)
    .pipe(coffeelint())
    .pipe(coffeelint.reporter());
});

var coffeeify = require('gulp-coffeeify');
var rename = require("gulp-rename");

gulp.task('js-coffee', function() {
  gulp.src(config.main)
    .pipe(coffeeify({
      options: {
        debug: true, // Generate source map 
        paths: [ __dirname + '/app/js' ]
      }
    }))
    .pipe(rename('app.js'))
    .pipe(gulp.dest(config.output))
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

gulp.task('hbs', function(){
  gulp.src(config.handlebars)
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
    .pipe(gulp.dest(config.output))
    .pipe(connect.reload());
});

//------------------------------------------------------------------------------
// Default
// This executes when you run 'gulp' on the command line
//------------------------------------------------------------------------------

gulp.task('default', ['css', 'js', 'hbs', 'bower'], function(){
  gulp.watch(config.stylesheets, ['css']);
  gulp.watch([config.javascripts, config.coffeescripts], ['js']);
  gulp.watch(config.handlebars, ['hbs']);
  gulp.watch(config.bower, ['bower']);
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
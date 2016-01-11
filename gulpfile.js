// TODO remove unused

var path = require('path');
var jade = require('gulp-jade');
var jadeCompiler = require('jade');
var gulp = require('gulp');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var batch = require('gulp-batch');
var inline = require('gulp-inline');
var livereload = require('gulp-livereload');
var runSequence = require('run-sequence');
var connect = require('connect');
var serveStatic = require('serve-static');
var fs = require('fs');
var proxy = require('proxy-middleware');
var url = require('url');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var inlineAssets = require('gulp-inline-assets');
var courseware = require("./main.js");
var baseDir = process.cwd();

var configFile = courseware.loadConfig();

// TODO courseware.json haveto exist
// TODO todos have to be defined and have proper structure
// TODO todo could have another names
// TODO todo file could be in other folder - some kind of template.
// TODO default config values
// TODO configure port of development server

var config = {
  header: configFile.header,
  todos: configFile.todos,
  baseDir: baseDir,
  introFilePath: path.join(baseDir, configFile.introFile),
  todoFilePath: path.join(configFile.todoFilePath, configFile.todoFile),
  lifeReloadPort: 35730,
  develServerPort: 8080,
  testsSocketUrl: configFile.testsSocketUrl
};

// escaping of html entities
jadeCompiler.filters.escape = function(block) {
  return block
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/#/g, '&#35;')
    .replace(/\\/g, '\\\\');
};

// TODO try to built into directives itself into template function
// escape {{}} by encapsulation into span with ng-non-bindable
jadeCompiler.filters.escape_ng = function(block) {
  var escaped = jadeCompiler.filters.escape(block);
  return '<span ng-non-bindable>' + escaped + '</span>';
};

// compile courseware less into css
gulp.task('less', function() {
  return gulp.src(__dirname + '/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest(__dirname + '/dist'));
});

// inline linked assets into css, fonts, images ...
gulp.task('css-build', ['less'], function() {
  return gulp.src(__dirname + '/dist/*.css')
    .pipe(inlineAssets())
    .pipe(gulp.dest(__dirname + '/dist'));
});

// inline assets into index.html - css, js, images
gulp.task('inline', function() {

  // TODO compile also javascript
  console.log('Inlining assets');

  return gulp.src(__dirname + '/dist/index.html')
    .pipe(inline({
      base: __dirname,
      //js: uglify,
      css: minifyCss
    }))
    .pipe(gulp.dest(baseDir));
});

// build jade into index.html
gulp.task('jade-build', function() {
  console.log('Building courseware');
  return jadeBuild();
});

// build jade into index.html with livereload server
gulp.task('jade-devel', function() {
  console.log('Building courseware with devel');
  return jadeBuild(true);
});

/**
 * Build jade into index.html
 *
 * @param {boolean} devel flag
 **/
function jadeBuild(devel) {
  return gulp.src(__dirname + '/jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      jade: jadeCompiler,
      locals: {
        devel: devel,
        config: config,
        baseDir: baseDir,
        render: jadeCompiler.renderFile
      }
    }))
    .pipe(gulp.dest(__dirname + '/dist/'));
}

/**
 * Watch courseware internals
 */
gulp.task('watch-courseware', function() {

  // watch less
  watch([__dirname + '/less/**/*.less'], batch(function(events, done) {
    gulp.start('css-build', done);
  }));

  // watch sources for inlining
  var inlinePaths = [
    __dirname + '/app/**/*.js',
    __dirname + '/dist/*.css'];

  watch(inlinePaths, batch(function(events, done) {
    gulp.start('inline', done);
  }));

  // build jade into index.html
  watch([__dirname + '/jade/**/*.jade'], batch(function(events, done) {
    gulp.start('jade-devel', done);
  }));
});

// TODO should be able to rebuild also when courseware.json changed - it needs to reload config
// watch host package and build final index.html
gulp.task('watch', function() {

  // watch jade templates of host package
  var paths = [
    baseDir + '/**/' + config.todoFilePath,
    config.introFilePath];

  watch(paths, batch(function(events, done) {
    gulp.start('jade-devel', done);
  }));

  // watch compiled index.html and inline into host package
  watch([__dirname + '/dist/index.html'], batch(function(events, done) {
    gulp.start('inline', done);
  }));
});

// run development server
gulp.task('connect', function() {
  console.log('Running development server : http://localhost:' + config.develServerPort);
  console.log('Livereload is listening on : http://localhost:' + config.lifeReloadPort);

  livereload.listen(config.lifeReloadPort);

  var app = connect();
  app.use(serveStatic(baseDir));
  app.listen(config.develServerPort);

  // livereload when final index.html is modified
  gulp.watch([config.baseDir + '/index.html']).on('change', function(filepath) {
    console.log('Reload courseware');
    livereload.changed(filepath, config.lifeReloadPort);
  });
});

gulp.task('courseware-devel', function() {
  runSequence(
    'devel',
    'watch-courseware'
  );
});

// TODO spead up livereload, inlining looks to be slow
gulp.task('devel', function() {
  runSequence(
    ['jade-devel', 'css-build', 'connect'],
    'inline',
    'watch'
  );
});

gulp.task('build', function() {
  runSequence(
    ['jade-build', 'css-build'],
    'inline'
  );
});

gulp.task('default', ['build']);
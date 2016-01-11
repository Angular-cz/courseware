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

var baseDir = process.cwd();

function loadConfig() {
  return JSON.parse(fs.readFileSync(baseDir + "/courseware.json").toString());
}

var configFile = loadConfig();

// TODO courseware.json haveto exist
// TODO todos have to be defined and have proper structure
// TODO todo could have another names
// TODO todo file could be in other folder - some kind of template.
// TODO default config valuesx
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

jadeCompiler.filters.escape = function(block) {
  return block
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/#/g, '&#35;')
    .replace(/\\/g, '\\\\');
};

// TODO built into directive itself into template function
jadeCompiler.filters.escape_ng = function(block) {
  var escaped = jadeCompiler.filters.escape(block);

  return '<span ng-non-bindable>' + escaped + '</span>';
};

gulp.task('less', function() {
  return gulp.src(__dirname + '/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest(__dirname + '/dist'));
});

gulp.task('css-build', ['less'], function() {
  return gulp.src(__dirname + '/dist/*.css')
    .pipe(inlineAssets())
    .pipe(gulp.dest(__dirname + '/dist'));
});

// TODO compile also javascript
gulp.task('inline', function() {
  console.log('Inlining assets');

  return gulp.src(__dirname + '/dist/index.html')
    .pipe(inline({
      base: __dirname,
      //js: uglify,
      css: minifyCss
    }))
    .pipe(gulp.dest(baseDir));
});

gulp.task('jade-build', function() {
  return gulp.src(__dirname + '/jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      jade: jadeCompiler,
      locals: {
        config: config,
        baseDir: baseDir,
        render: jadeCompiler.renderFile
      }
    }))
    .pipe(gulp.dest(__dirname + '/dist/'));
});

gulp.task('jade-devel', function() {
  console.log('Building courseware');
  return gulp.src(__dirname + '/jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      jade: jadeCompiler,
      locals: {
        devel: true,
        config: config,
        baseDir: baseDir,
        render: jadeCompiler.renderFile
      }
    }))
    .pipe(gulp.dest(__dirname + '/dist/'));
});

gulp.task('watch-courseware', function() {
  // TODO watch less
  var paths = [
    __dirname + '/app/**/*.js',
    __dirname + '/jade/**/*.jade'];

  watch(paths, batch(function(events, done) {
    gulp.start('jade-devel', done);
  }));
});

// TODO should be able to rebuild also when courseware.json changed - it needs to reload config
gulp.task('watch', function() {
  var paths = [
    baseDir + '/**/' + config.todoFilePath,
    config.introFilePath];

  watch(paths, batch(function(events, done) {
    gulp.start('jade-devel', done);
  }));

  watch([__dirname + '/dist/index.html'], batch(function(events, done) {
    gulp.start('inline', done);
  }));
});


gulp.task('connect', function() {
  console.log('Running development server : http://localhost:' + config.develServerPort);
  console.log('Livereload is listening on : http://localhost:' + config.lifeReloadPort);
  livereload.listen(config.lifeReloadPort);

  var app = connect();
  app.use(serveStatic(baseDir));
  app.listen(config.develServerPort);

  gulp.watch([config.baseDir + '/index.html']).on('change', function(filepath) {

    console.log('Reload courseware');
    livereload.changed(filepath, config.lifeReloadPort);
  });
});

gulp.task('devel-devel', function() {
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
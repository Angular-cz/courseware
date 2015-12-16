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

var config = {
  header: configFile.header,
  todos: configFile.todos,
  baseDir : baseDir,
  introFilePath: path.join(baseDir, configFile.introFile),
  todoFilePath : path.join(configFile.todoFilePath, configFile.todoFile)
};

console.log(config);

jadeCompiler.filters.escape = function(block) {
    return block
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/#/g, '&#35;')
      .replace(/\\/g, '\\\\');
};


jadeCompiler.filters.escape_ng = function(block) {
  var escaped = jadeCompiler.filters.escape(block);

  return '<span ng-non-bindable>' + escaped + '</span>';
};

/*
gulp.task('jade', function () {
  gulp.src('jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      jade:jadeCompiler,
      locals: {
        devel: true,
        todos: loadTodos(),
        render: jadeCompiler.renderFile
      }
    }))
    .pipe(gulp.dest('./'))
});
*/

gulp.task('less', function () {
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

// TODO compile javascript
gulp.task('inline', function () {
  return gulp.src(__dirname + '/dist/index.html')
    .pipe(inline({
      base: __dirname,
      //js: uglify,
      css: minifyCss
    }))
    .pipe(gulp.dest(baseDir));
});

gulp.task('jade-build', function () {
  return gulp.src(__dirname + '/jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      jade:jadeCompiler,
      locals: {
        config: config,
        baseDir: baseDir,
        render: jadeCompiler.renderFile
      }
    }))
    .pipe(gulp.dest(__dirname + '/dist/'));
});
/*
gulp.task('watch', function() {
  watch(['jade/!*.jade', '../!*!/complete/todo.jade'], batch(function (events, done) {
    gulp.start('jade', done);
  }));

  watch(['less/!*.less'], batch(function (events, done) {
    gulp.start('less', done);
  }));
})

gulp.task('connect', function () {

  livereload.listen(config.httpServer.lrPort);

  var app = connect();
  app.use(serveStatic('../'));
  app.listen(config.httpServer.port);

  gulp.watch(['index.html','app/!*.js', 'css/!*.css']).on('change', function (filepath) {
    livereload.changed(filepath, config.httpServer.lrPort);
  });

  app.use('/api', proxy(url.parse(config.proxy)));
});

gulp.task('devel', function () {
  runSequence(
    ['jade', 'connect', 'less'],
    'watch'
  );
});*/

gulp.task('build', function () {
  runSequence(
    ['jade-build', 'css-build'],
    'inline'
  );
});

// TODO development mode with livereload for todos
// TODO development mode for this tool
gulp.task('default', ['build']);
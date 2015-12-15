// TODO remove unused

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


var baseDir = process.cwd();

function loadTodos() {
  return JSON.parse(fs.readFileSync(baseDir + "/todos.json").toString());
}

// TODO remove unused livereload tasks if not needed
// build todoapp css files

var config = {
  httpServer: {
    host: 'localhost',
    port: 8283,
    lrPort: 35730
  },
  proxy:'http://angular-cz-js-api.herokuapp.com/'
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


jadeCompiler.filters.escape_ng = function(block) {
  var escaped = jadeCompiler.filters.escape(block);

  return '<span ng-non-bindable>' + escaped + '</span>';
}

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



gulp.task('less-todo', function () {
  gulp.src('../css/!*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest('../css'));
});

*/


gulp.task('less', function () {
  gulp.src(__dirname + '/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(gulp.dest(__dirname + '/dist'));
});


// TODO compile javascript

gulp.task('inline', function () {
  gulp.src(__dirname + '/dist/index.html')
    .pipe(inline({
      base: __dirname,
      //js: uglify,
      css: minifyCss
    }))
    .pipe(gulp.dest(baseDir));
});



gulp.task('jade-build', function () {
  gulp.src(__dirname + '/jade/index.jade')
    .pipe(plumber())
    .pipe(jade({
      jade:jadeCompiler,
      locals: {
        todos: loadTodos(),
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

  watch(['../css/!*.less'], batch(function (events, done) {
    gulp.start('less-todo', done);
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
    ['jade-build', 'less'],
    'inline'
  );
});

gulp.task('default', ['build'])
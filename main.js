var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var Promise = require('promise');

var baseDir = findBaseDir();
var config = loadConfig(baseDir);

function findBaseDir(){
  var configName = path.join(process.cwd(), "courseware.json");

  if (fs.existsSync(configName)) {
    return process.cwd();
  }

  var findRoot = require('find-root');
  return findRoot(process.cwd());
}

/**
 * Loads config courseware.json synchronously
 */
function loadConfig() {
  // TODO check if exists
  // TODO default values

  var configName = path.join(baseDir, "courseware.json");

  // TODO config is loaded twice
  console.log('Loading config:' + configName);

  return JSON.parse(fs.readFileSync(configName).toString());
}

module.exports.loadConfig = loadConfig;

/**
 * Initialize socket server which notifies clients about test result changes
 * Test results folder is read from config or from parameter
 *
 * @param server server to which socket server is attached
 * @param testsResultDirname optional - its read from config by default
 */
function connectTestResultsSocket(server) {
  // TODO check config value

  console.log('Courseware: initializing socket server');

  var io = require('socket.io')(server);

  // there can be multiple clients connected
  var listeningSockets = [];

  // TODO check if directory exists
  io.on('connection', function(socket) {

    // handling request for sending current results
    socket.on('resultRequest', function(todoName) {
      var todoResultPath = getTestResultsFilename(todoName);
      var results = loadTestResults(todoResultPath);
      if (results) {
        console.log('Courseware: Test results sent on request :' + results.exercise);
        socket.emit('testResults', results);
      }
    });

    // attach current listener
    listeningSockets.push(socket);
    console.log('Courseware: connected socket: listeners: ' + listeningSockets.length);

    // removes socket from listeners
    socket.on('disconnect', function() {

      var index = listeningSockets.indexOf(socket);
      if (index > -1) {
        listeningSockets.splice(index, 1);
      }

      console.log('Courseware: disconnected socket: listeners: ' + listeningSockets.length);
    });

  });

  // watch test results path for changes
  var todoResultsPath = path.join(getTestResultsDir(), '/*.json');
  console.log('Courseware: Watching test results in: ' + todoResultsPath);

  gulp.watch(todoResultsPath, function(change) {
    var results = loadTestResults(change.path);
    if (results) {
      console.log('Courseware: Test results actualized :' + results.exercise);
      listeningSockets.map(function(socket) {
        socket.emit('testResults', results);
      });
    }
  });

  return {
    notify: function(eventName, data) {
      listeningSockets.map(function(socket) {
        socket.emit(eventName, data);
      });
    }
  };
}

module.exports.socketServer = connectTestResultsSocket;

/**
 * Loads data for test results from file .json file
 *
 * @param todoResultPath path of json file
 * @returns {{exercise, data}} object with named test results
 * @todo consider using exceptions
 */
function loadTestResults(todoResultPath) {
  var data = fs.readFileSync(todoResultPath);

  try {
    return {
      exercise: path.basename(todoResultPath, '.json'),
      data: JSON.parse(data.toString())
    };
  } catch (error) {
    console.warn('Courseware: Parsing test results', todoResultPath, 'failed with error', error.message);
    return false;
  }
}

/**
 * Initialize test results by running karma for each exercise which contains karma.conf.js
 * Karma server of the host package should be sent as parameter, because of particular configuration
 *
 * This function both return promise and utilize callback
 *
 * @param karmaServer karma server class to instantiate
 * @param cb callback which is called after all tests finish
 * @returns Promise
 */
function initializeTestResults(karmaServer, cb) {
  var todos = config.todos;

  var todoPromises = todos
    .filter(nonTestable)
    .filter(alreadyRun)
    .map(toPromise);

  return Promise.all(todoPromises)
    .then(function(value) {
      if (typeof cb == 'function') {
        cb()
      }
      return value;
    });

  /**
   * Check if there is karma config
   */
  function nonTestable(todo) {
    var karmaConf = karmaConfFilename(todo);
    return fs.existsSync(karmaConf);
  }

  /**
   * Check if todo has been already run
   */
  function alreadyRun(todo) {
    var testResults = getTestResultsFilename(todo);
    if (fs.existsSync(testResults)) {
      console.log('Test results exists : ' + todo);
      return false;
    }

    return true;
  }

  /**
   * Create promise from karma calling on todo
   * @param todo
   * @returns promise
   */
  function toPromise(todo) {
    var karmaConf = karmaConfFilename(todo);
    console.log('Running tests for : ' + todo);

    return karmaPromise(karmaServer, karmaConf)
      .then(function() {
        return console.log('Finished tests : ' + todo);
      });
  }

  /**
   * Start karma server for given config and create promise from it
   * @param karmaServer
   * @param karmaConf
   * @returns {promise}
   */
  function karmaPromise(karmaServer, karmaConf) {
    return new Promise(function(resolve, reject) {
      new karmaServer({
        configFile: karmaConf,
        singleRun: true
      }, resolve).start();
    });
  }

  /**
   * Get karma config filename of todo
   * @param todo
   * @returns {string} karma config filename
   */
  function karmaConfFilename(todo) {
    // TODO configurable file
    return path.join(baseDir, todo, 'karma.conf.js');
  }
}

module.exports.initializeTestResults = initializeTestResults;

/**
 * Check if testResults directory exists if not, its created
 * @returns {boolean} true if directory has been created
 */
function getTestResultsDir() {
  // TODO check config value
  return path.join(baseDir, config.testsResultsPath);
}

module.exports.getTestResultsDir = getTestResultsDir;

/**
 * Get name of test results file for given todo
 *
 * @param todo
 * @returns {string} test-results filename
 */
function getTestResultsFilename(todo) {
  return path.join(baseDir, config.testsResultsPath, todo + '.json');
}

module.exports.getTestResultsFilename = getTestResultsFilename;

/**
 * Determine current exercise from config or process.cwd
 *
 * @param karmaConfig karma config
 */
function determineExerciseName(karmaConfig) {
  var processCwd = process.cwd();

  if (karmaConfig.configFile) {
    var configDir = path.dirname(karmaConfig.configFile);
    var exerciseName = path.basename(configDir);
  }

  if (config.todos.indexOf(exerciseName) == -1) {
    var exerciseName = path.basename(process.cwd());
  }

  if (config.todos.indexOf(exerciseName) == -1) {
    throw new Exception('Exercise wasnt determined', karmaConfig, processCwd);
  }

  return exerciseName;
}

module.exports.determineExerciseName = determineExerciseName;

module.exports.version = require('./package.json').version;

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');

function connectTestResultsSocket(server, testsResultDirname) {
  console.log('Courseware: initializing socket server');

  var io = require('socket.io')(server);

  var listeningSockets = [];

  io.on('connection', function(socket) {
    socket.on('resultRequest', function(todoName) {
      var todoResultPath = path.join(process.cwd(), testsResultDirname, todoName + '.json');

      var results = loadTestResults(todoResultPath);
      console.log('Courseware: Test results sent on request :' + results.exercise);

      socket.emit('testResults', results);
    });

    listeningSockets.push(socket);
    console.log('Courseware: connected socket: listeners: ' + listeningSockets.length);

    socket.on('disconnect', function() {

      var index = listeningSockets.indexOf(socket);
      if (index > -1) {
        listeningSockets.splice(index, 1);
      }

      console.log('Courseware: disconnected socket: listeners: ' + listeningSockets.length);
    });

  });

  var todoResultsPath = path.join(process.cwd(), testsResultDirname, '/*.json');
  console.log('Courseware: Watching test results in: ' + todoResultsPath);

  gulp.watch(todoResultsPath, function(change) {
    var results = loadTestResults(change.path);
    console.log('Courseware: Test results actualized :' + results.exercise);

    listeningSockets.map(function(socket) {
      socket.emit('testResults', results);
    });
  });
}

function loadTestResults(todoResultPath, socket) {
  var data = fs.readFileSync(todoResultPath);

  var results = {
    exercise: path.basename(todoResultPath, '.json'),
    data: JSON.parse(data.toString())
  };

  return results;
}

module.exports.socketServer = connectTestResultsSocket;

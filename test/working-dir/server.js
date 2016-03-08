var connect = require('connect');
var serveStatic = require('serve-static');
var courseware = require('../../main');

var config = {
  httpServer: {
    host: 'localhost',
    port: process.env.PORT || 8080
  }
};

console.log("Http-server running on http://localhost:" + config.httpServer.port);

var app = connect();

app.use(serveStatic('./'));

var server = app.listen(config.httpServer.port);

// connect test results visualization socket server
courseware.socketServer(server);

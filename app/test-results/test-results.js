(function() {
  angular.module('ngCzCourseWare')
    .service('testResults', TestsResults)
    .provider('socketConnector', SocketConnector)

  function SocketConnector() {

    var url;
    this.setUrl = function(newUrl) {
      url = newUrl;
    };

    this.$get = function(socketFactory) {
      if (typeof io !== 'undefined' && url) {
        var myIoSocket = io.connect(url);

        var socket = socketFactory({
          ioSocket: myIoSocket
        });
      }

      if (!socket) {
        return {
          requestTestResults : function() {},
          onActualization : function() {}
        };
      }

      return {
        requestTestResults: function(todoName) {
          socket.emit('resultRequest', todoName)
        },
        onActualization: function(callback) {
          socket.on('testResults', callback);
        }
      }
    }
  }

  function TestResultsLoader(testResultsParser) {
    this.setResults = function(data) {
      this.lastResults = testResultsParser.getFlattened(data);
    };

    this.getResultsFor = function(todo) {
      if (!this.lastResults) {
        return;
      }

      return testResultsParser.getResultsFor(todo, this.lastResults);
    }
  }

  function TestsResults($rootScope, socketConnector, $injector) {

    this.resultLoaders = {};

    this.getResultsLoader = function(todoName) {
      if (!this.resultLoaders[todoName]) {
        socketConnector.requestTestResults(todoName);
        this.resultLoaders[todoName] = $injector.instantiate(TestResultsLoader);
      }

      return this.resultLoaders[todoName];
    };

    this.actualizeData_ = function(message) {
      var loader = this.getResultsLoader(message.exercise);
      console.log('Actualization of todo:' + message.exercise);
      loader.setResults(message);


      $rootScope.$broadcast('todo:actualized');
    };

    socketConnector.onActualization(this.actualizeData_.bind(this));
  }
})();

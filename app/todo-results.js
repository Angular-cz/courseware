(function() {
  angular.module('ngCzCourseWare')
    .service('testResults', TestsResults)
    .service('testResultsParser', TestResultsParser)
    .provider('socketConnector', SocketConnector)
    .directive('tests', testsDirective);

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

  function TestResultsParser() {

    this.getResultsFor = function(todo, testResults) {
      var tests = this.getLinesFor(todo, testResults);

      var result = {};
      result.total = tests.length;
      result.passed = tests.filter(function(item) {
        return item.type === "PASSED";
      }).length;

      result.tests = tests;

      return result;
    };

    this.getLinesFor = function(todo, testResults) {
      return testResults.filter(function(item) {
        var todoName = '(TODO ' + todo + ')';
        return item.name.indexOf(todoName) > -1
      });
    };

    this.getFlattened = function(data) {

      function Item(name, type) {
        this.name = name;
        this.type = type;
      }

      // TODO - refactor, it is midnight coding - functional - but uggly (but you have tests)
      function parseData(data, prefix) {
        prefix = (prefix) ? prefix + ' ' : '';

        for (var key in data) {
          var value = data[key];
          var name = prefix + key;

          if (typeof value === "object") {
            parseData(value, name)
          } else {
            result.push(new Item(name, data[key]));
          }
        }
      }

      var result = [];

      parseData(data, '');

      return result;
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

  function TestsResults($stateParams, $rootScope, socketConnector, $injector) {

    this.resultLoaders = {};

    this.getResultsLoader = function(todoName) {
      if (!this.resultLoaders[todoName]) {
        socketConnector.requestTestResults(todoName);
        this.resultLoaders[todoName] = $injector.instantiate(TestResultsLoader);
      }

      return this.resultLoaders[todoName];
    };

    this.getResultsLoaderByRoute = function() {
      return this.getResultsLoader($stateParams.name);
    };

    this.actualizeData_ = function(message) {
      var loader = this.getResultsLoader(message.exercise);
      console.log('Actualization of todo:' + message.exercise);
      loader.setResults(message);


      $rootScope.$broadcast('todo:actualized');
    };

    socketConnector.onActualization(this.actualizeData_.bind(this));
  }

  function testsDirective(testResults) {
    return {
      restrict: 'E',
      scope: {
        todo: '@'
      },
      templateUrl: "directive-tests",
      link: function(scope) {
        var loader = testResults.getResultsLoaderByRoute();
        scope.results = loader.getResultsFor(scope.todo);

        scope.$on('todo:actualized', function() {
          scope.results = loader.getResultsFor(scope.todo);
        });

        scope.isPassed = function() {
          return scope.results && scope.results.passed === scope.results.total;
        }
      }
    }
  }
})();

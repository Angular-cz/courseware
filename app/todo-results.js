(function() {
  angular.module('ngCzCourseWare')
    .service('testResults', TestsResults)
    .directive('tests', testsDirective);

  function TestsResults($stateParams) {
    var TMP = {
      "TimeoutPromise je definována jako funkce (TODO 1.1)": {
        "se dvěma parametry": "PASSED",
        "která vrací promise": "FAILED"
      },
      "TimeoutPromise": {
        "hodnota je stejná jako návratová hodnota conditionFunction (TODO 1.2)": "FAILED",
        "pokud funkce vrátí null je promise rejected (TODO 1.3)": "FAILED"
      },
      "TimeoutPromise conditionFunction": {
        "je volána s definovaným zpožděním (TODO 1.4)": "FAILED"
      }
    };

    // todo reaction to socket - fills data
    // todo possibility to get service for routename

    // todo initial load return promise and fill object
    this.loadInitialData = function() {
      this.lastResults = this.getFlattened(TMP);
    }

    this.getResultsFor = function(todo) {
      if (!this.lastResults) {
        this.loadInitialData();
      }

      var tests = this.getLinesFor(todo);

      var result = {};
      result.total = tests.length;
      result.passed = tests.filter(function(item) {
        return item.type === "PASSED";
      }).length;

      result.tests = tests;

      return result;
    }

    this.getLinesFor = function(todo) {

      // todo return promise
      return this.lastResults.filter(function(item) {
        var todoName = '(TODO ' + todo + ')';
        return item.name.indexOf(todoName) > -1
      });
    }

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

  function testsDirective(testResults) {
    return {
      restrict: 'E',
      scope: {
        todo: '@'
      },
      templateUrl: "directive-tests",
      link: function(scope) {
        scope.results = testResults.getResultsFor(scope.todo);

        scope.isPassed = function() {
          return scope.results.passed === scope.results.total;
        }
      }

    }
  }
})();

(function() {
  angular.module('ngCzCourseWare')
    .service('testResultsParser', TestResultsParser)

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
})();

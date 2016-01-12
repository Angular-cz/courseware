(function() {
  angular.module('ngCzCourseWare')
    .service('testResultsParser', TestResultsParser);

  /**
   * Parser of incomming test results to flat form suitable for displaying
   *
   * @constructor
   */
  function TestResultsParser() {

    /**
     * Find particular todo in testResults
     *
     * TODO allow to find more then one todo in same request.
     * TODO support for pending tests
     *
     * @param todo
     * @param testResults
     * @returns array of results with information about total and number of passed tests
     *
     *
     * example: {
     *   total: 3,
     *   passed: 2,
     *   tests: [
     *     {
     *       name: 'Test 1 (TODO 1.1)',
     *       type: 'PASSED'
     *     },
     *     ...
     *   ]
     * }
     */
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

    /**
     * Filter lines which contains given todo in form of (TODO <todo>)
     *
     * @param todo
     * @param testResults
     * @returns array of results which contains todos in form
     *
     * {
     *    name: 'Test name (TODO <todo>)',
     *    type: 'FAILED'
     * }
     */
    this.getLinesFor = function(todo, testResults) {
      return testResults.filter(function(item) {
        var todoName = '(TODO ' + todo + ')';
        return item.name.indexOf(todoName) > -1
      });
    };

    /**
     * Flattens tree structure of given results to the simple objects
     *
     * @param testResults
     * @returns {Array}
     */
    this.getFlattened = function(testResults) {

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

      parseData(testResults, '');

      return result;
    }
  }
})();

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
     *
     * @param todo
     * @param testResults
     * @returns object with information about total and number of passed tests
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
      var filter = this.getFilterFor_(todo);
      var tests = testResults.filter(function(item) {
        return filter(item.name)
      });
      return this.getResults_(tests);
    };

    /**
     * Find particular results without todo
     *
     * @param testResults
     * @returns object of results (see this.getResults_)
     */
    this.getResultsWithoutTodo = function(testResults) {
      var tests = testResults.filter(function(item) {
        var todoName = '(TODO ';
        return item.name.indexOf(todoName) > -1
      });

      return this.getResults_(tests);
    };

    /**
     * @private
     *
     * @param tests
     * @returns object with information about total and number of passed tests
     *
     * TODO support for pending tests
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
    this.getResults_ = function(tests) {
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
     * @private
     * @param todo
     * @returns function usable as array filter
     */
    this.getFilterFor_ = function(todo) {
      if (!todo) {
        return function() {
          return true;
        };
      }

      var todos = todo.split(',');
      var todoNames = todos.map(function(todo) {
        return '(TODO ' + todo + ')'
      });

      var escapedNames = todoNames.map(regexpEscape);

      var regExp = new RegExp('(' + escapedNames.join(')|(') + ')', 'i');

      return regExp.test.bind(regExp);
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

function regexpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

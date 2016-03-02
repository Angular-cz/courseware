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
     *
     * @param testResults
     * @param todo
     * @param exact
     * @returns object with information about total and number of passed tests
     *
     *
     * example: {
     *   total: 3,
     *   passed: 2,
     *   tests: [
     *     {
     *       name: 'Test 1 (TODO 1.1)',
     *       "log": [],
     *       "time": 14,
     *       status: 'PASSED'
     *     },
     *     ...
     *   ]
     * }
     */
    this.getResultsFor = function(testResults, todo, exact) {
      var filter = this.filterFactory_(todo, exact);
      var tests = testResults.filter(function(item) {
        return filter(item.name)
      });
      return this.getResults_(tests, testResults.browserErrors);
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

      return this.getResults_(tests, testResults.browserErrors);
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
     *       "log": [],
     *       "time": 14,
     *       status: 'PASSED'
     *     },
     *     ...
     *   ]
     * }
     */
    this.getResults_ = function(tests, browserErrors) {
      var result = {};

      if (browserErrors) {
        result.browserErrors = browserErrors
      }

      result.total = tests.length;
      result.passed = tests.reduce(countByFilterReducer(filterPassed), 0);
      result.skipped = tests.reduce(countByFilterReducer(filterSkipped), 0);

      result.tests = tests;

      return result;
    };

    function filterPassed(item) {
      return item.status === 'PASSED';
    }

    function filterSkipped(item) {
      return item.status === 'SKIPPED';
    }

    function countByFilterReducer(filter) {
      return function(count, item) {
        if (filter(item)) {
          return count + 1;
        }
        return count;
      }
    }

    /**
     * Filter lines which contains given todo in form of (TODO <todo>)
     *
     * @private
     * @param todo
     * @param boolean exact (default false)
     * @returns function usable as array filter
     */
    this.filterFactory_ = function(todo, exact) {
      var regexpSufix = '[\\.\\d]*';
      if (exact) {
        regexpSufix = '';
      }

      if (!todo) {
        return function() {
          return true;
        };
      }

      var todoName = '\\(TODO ' + regexpEscape(todo) + regexpSufix + '\\)';
      var regExp = new RegExp(todoName, 'i');

      return regExp.test.bind(regExp);
    };

    /**
     * Flattens tree structure of given results to the simple objects
     *
     * @param testResults
     * @returns {Array}
     */
    this.getFlattened = function(testResults) {
      var result = [];
      if (testResults['__BROWSER_ERRORS__']) {
        result.browserErrors = testResults['__BROWSER_ERRORS__'];
        delete testResults['__BROWSER_ERRORS__'];
      }

      parseData(testResults, '');

      return result;
    }
  }
})();

function Result(name, data) {
  this.name = name;
  this.status = data.status;
  this.log = data.log;
  this.time = data.time;
}

// TODO - refactor, it is midnight coding - functional - but uggly (but you have tests)
function parseData(data, prefix) {
  prefix = (prefix) ? prefix + ' ' : '';

  for (var key in data) {

    var value = data[key];
    var name = prefix + key;

    if (!value.status) {
      parseData(value, name)
    } else {
      result.push(new Result(name, data[key]));
    }
  }
}

function regexpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

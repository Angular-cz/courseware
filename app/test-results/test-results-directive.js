(function() {
  angular.module('ngCzCourseWare')
    .directive('tests', testsDirective)
    .directive('testsResults', testsResultsDirective)
    .directive('testsExists', testsExistsDirective);

  function BaseTestDirectiveController($scope, exerciseName) {
    this.exercise = exerciseName;

    // reaction on test results actualization
    $scope.$on('todo:actualized', function() {
      this.actualizeResults_();
    }.bind(this));

    this.actualizeResults_();
  }

  /**
   * @abstract
   */
  BaseTestDirectiveController.prototype.getResults = function() {
    throw new Error('getResults must be reimplemented in child class!')
  };

  /**
   * Load test results of this block
   */
  BaseTestDirectiveController.prototype.actualizeResults_ = function() {
    this.lastModified = this.getResultsLoader().lastModified;
    this.results = this.getResults();
  };

  BaseTestDirectiveController.prototype.getResultsLoader = function() {
    return this.testResults.getResultsLoader(this.exercise);
  };
  
  /**
   * Check if all tests passes
   *
   * @returns {boolean}
   */
  BaseTestDirectiveController.prototype.isPassed = function() {
    return this.results &&
      this.results.passed !== 0 &&
      this.results.passed === this.results.total;
  };

  BaseTestDirectiveController.prototype.getClassFor = function(test) {
    if (test.noExpectationsWarning) {
      return 'no-expectation';
    }

    return test.status.toLowerCase();
  };

  BaseTestDirectiveController.prototype.isSlow = function(test) {
    return test.time > 100;  // TODO config
  };

  /**
   * Directive which shows test results, it takes name of todo which will be searched in results.
   * Directives gather exercise name from router and ask for particular result loader
   *
   * When there are incoming test results, todo:actualized is fired and directive can reload.
   * @param testResults
   * @param $stateParams
   */
  function testsDirective() {

    function TestsDirectiveController($scope, testResults, $stateParams, $attrs) {
      this.testResults = testResults;
      this.$attrs = $attrs;

      BaseTestDirectiveController.call(this, $scope, $stateParams.name);
    }

    TestsDirectiveController.prototype = Object.create(BaseTestDirectiveController.prototype);
    TestsDirectiveController.constructor = TestsDirectiveController;

    TestsDirectiveController.prototype.getResults = function() {
      var loader = this.getResultsLoader();

      if (this.$attrs.hasOwnProperty('withoutTodo')) {
        return loader.getResultsWithoutTodo()
      } else {
        return loader.getResultsFor(this.todo, this.$attrs.hasOwnProperty('exact'));
      }
    };

    return {
      restrict: 'E',
      templateUrl: "directive-tests",
      scope: {},
      bindToController: {
        todo: '@?'
      },
      controller: TestsDirectiveController,
      controllerAs: 'tests'
    };

  }

  /**
   * Directive which shows all test results
   * Directives gather exercise name from router and ask for particular result loader
   *
   * When there are incoming test results, todo:actualized is fired and directive can reload.
   * @param testResults
   * @param $stateParams
   */
  function testsResultsDirective() {

    function TestsResultsDirectiveController($scope, testResults, $stateParams, $attrs) {
      this.testResults = testResults;
      this.$attrs = $attrs;

      BaseTestDirectiveController.call(this, $scope, $stateParams.name);
      this.showTests = !$attrs.hasOwnProperty('titleOnly');

    }

    TestsResultsDirectiveController.prototype = Object.create(BaseTestDirectiveController.prototype);
    TestsResultsDirectiveController.constructor = TestsResultsDirectiveController;

    TestsResultsDirectiveController.prototype.getResults = function() {
      var loader = this.getResultsLoader();
      return loader.getResultsFor();
    };

    return {
      restrict: 'E',
      templateUrl: "directive-tests-results",
      transclude: true,
      scope: {},
      controller: TestsResultsDirectiveController,
      controllerAs: 'tests'
    };
  }

  /**
   * Directive which shows all test results
   * Directives gather exercise name from router and ask for particular result loader
   *
   * When there are incoming test results, todo:actualized is fired and directive can reload.
   * @param testResults
   * @param $stateParams
   */
  function testsExistsDirective() {

    function TestsExistsDirectiveController($scope, testResults, $stateParams, $attrs) {
      this.testResults = testResults;
      this.$attrs = $attrs;

      BaseTestDirectiveController.call(this, $scope, $stateParams.name);
    }

    TestsExistsDirectiveController.prototype = Object.create(BaseTestDirectiveController.prototype);
    TestsExistsDirectiveController.constructor = TestsExistsDirectiveController;

    TestsExistsDirectiveController.prototype.getResults = function() {
      var loader = this.getResultsLoader();
      return loader.getResultsFor(this.todo, this.$attrs.hasOwnProperty('exact'));
    };

    /**
     * Check if all tests passes
     *
     * @returns {boolean}
     */
    TestsExistsDirectiveController.prototype.exists = function() {
      return this.results.total > 0;
    };

    return {
      restrict: 'E',
      templateUrl: "directive-tests-exists",
      transclude: true,
      scope: {},
      bindToController: {
        todo: '@?'
      },
      controller: TestsExistsDirectiveController,
      controllerAs: 'tests'
    };

  }

})();

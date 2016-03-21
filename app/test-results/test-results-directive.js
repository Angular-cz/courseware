(function() {
  angular.module('ngCzCourseWare')
    .directive('tests', testsDirective)
    .directive('testsResults', testsResultsDirective)
    .directive('testsExists', testsExistsDirective);

  function BaseTestDirectiveController($scope) {

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
    this.results = this.getResults();
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
    return test.time > 10;
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
      this.$stateParams = $stateParams;
      this.$attrs = $attrs;

      BaseTestDirectiveController.call(this, $scope);
    }

    TestsDirectiveController.prototype = Object.create(BaseTestDirectiveController.prototype);
    TestsDirectiveController.constructor = TestsDirectiveController;

    TestsDirectiveController.prototype.getResults = function() {
      var loader = this.testResults.getResultsLoader(this.$stateParams.name);

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
      this.$stateParams = $stateParams;
      this.$attrs = $attrs;
      this.showTests = !$attrs.hasOwnProperty('titleOnly');

      TestsResultsDirectiveController.call(this, $scope);
    }

    TestsResultsDirectiveController.prototype = Object.create(BaseTestDirectiveController.prototype);
    TestsResultsDirectiveController.constructor = TestsResultsDirectiveController;

    TestsResultsDirectiveController.prototype.getResults = function() {
      var loader = this.testResults.getResultsLoader(this.$stateParams.name);
      this.results = loader.getResultsFor();
    };

    return {
      restrict: 'E',
      templateUrl: "directive-tests-results",
      transclude: true,
      scope: {},
      controller: testsResultsDirectiveController,
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
      this.$stateParams = $stateParams;
      this.$attrs = $attrs;

      TestsExistsDirectiveController.call(this, $scope);
    }

    TestsExistsDirectiveController.prototype = Object.create(BaseTestDirectiveController.prototype);
    TestsExistsDirectiveController.constructor = TestsExistsDirectiveController;

    TestsExistsDirectiveController.prototype.getResults = function() {
      var loader = this.testResults.getResultsLoader(this.$stateParams.name);
      this.results = loader.getResultsFor(this.todo, this.$attrs.hasOwnProperty('exact'));
    };

    return {
      restrict: 'E',
      templateUrl: "directive-tests-exists",
      transclude: true,
      scope: {},
      bindToController: {
        todo: '@?'
      },
      controller: testsExistsDirectiveController,
      controllerAs: 'tests'
    };

  }

})();

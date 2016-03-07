(function() {
  angular.module('ngCzCourseWare')
    .directive('tests', testsDirective)
    .directive('testsResults', testsResultsDirective)
    .directive('testsExists', testsExistsDirective)

  /**
   * Directive which shows test results, it takes name of todo which will be searched in results.
   * Directives gather exercise name from router and ask for particular result loader
   *
   * When there are incoming test results, todo:actualized is fired and directive can reload.
   * @param testResults
   * @param $stateParams
   */
  function testsDirective() {
    return {
      restrict: 'E',
      templateUrl: "directive-tests",
      scope: {},
      bindToController: {
        todo: '@?'
      },
      controller: testsDirectiveController,
      controllerAs: 'tests'
    };

    function testsDirectiveController($scope, testResults, $stateParams, $attrs) {
      this.getResults = function() {
        var loader = testResults.getResultsLoader($stateParams.name);

        if ($attrs.hasOwnProperty('withoutTodo')) {
          return loader.getResultsWithoutTodo()
        } else {
          return loader.getResultsFor(this.todo, $attrs.hasOwnProperty('exact'));
        }
      };

      /**
       * Load test results of this block
       */
      this.actualizeResults_ = function() {
        this.results = this.getResults();
      };

      this.actualizeResults_();

      /**
       * Check if all tests passes
       *
       * @returns {boolean}
       */
      this.isPassed = function() {
        return isResultPassed(this.results);
      };

      // reaction on test results actualization
      $scope.$on('todo:actualized', function() {
        this.actualizeResults_();
      }.bind(this));

    }
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
    return {
      restrict: 'E',
      templateUrl: "directive-tests-results",
      transclude: true,
      scope: {},
      controller: testsResultsDirectiveController,
      controllerAs: 'tests'
    };

    function testsResultsDirectiveController($scope, testResults, $stateParams, $attrs) {
      this.showTests = !$attrs.hasOwnProperty('titleOnly');

      /**
       * Load test results of this block
       */
      this.actualizeResults_ = function() {
        var loader = testResults.getResultsLoader($stateParams.name);
        this.results = loader.getResultsFor();
      };

      this.actualizeResults_();

      /**
       * Check if all tests passes
       *
       * @returns {boolean}
       */
      this.isPassed = function() {
        return isResultPassed(this.results);
      };

      // reaction on test results actualization
      $scope.$on('todo:actualized', function() {
        this.actualizeResults_();
      }.bind(this));

    }
  }

  function isResultPassed(results) {
    return results &&
      results.passed !== 0 &&
      results.passed === results.total;
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

    function testsExistsDirectiveController($scope, testResults, $stateParams, $attrs) {
      /**
       * Load test results of this block
       */
      this.actualizeResults_ = function() {
        var loader = testResults.getResultsLoader($stateParams.name);
        this.results = loader.getResultsFor(this.todo, $attrs.hasOwnProperty('exact'));
      };

      this.actualizeResults_();

      /**
       * Check if all tests passes
       *
       * @returns {boolean}
       */
      this.exists = function() {
        return this.results.total > 0;
      };

      // reaction on test results actualization
      $scope.$on('todo:actualized', function() {
        this.actualizeResults_();
      }.bind(this));

    }
  }

})();

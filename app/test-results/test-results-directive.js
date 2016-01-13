(function() {
  angular.module('ngCzCourseWare')
    .directive('tests', testsDirective)
    .directive('testsResults', testsResultsDirective)

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
          return loader.getResultsFor(this.todo)
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
        return this.results && this.results.passed === this.results.total;
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
      controllerAs: 'tests',
      link: function(s, e, a, controller, transcludeFn) {
        transcludeFn(function(clone) {
          controller.hasTranscludedContent = Boolean(clone.text().length)
        });
      }
    };

    function testsResultsDirectiveController($scope, testResults, $stateParams, $attrs) {
      this.hasTranscludedContent = false;
      this.showTests = $attrs.hasOwnProperty('showTests');

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
        return this.results && this.results.passed === this.results.total;
      };

      // reaction on test results actualization
      $scope.$on('todo:actualized', function() {
        this.actualizeResults_();
      }.bind(this));

    }
  }
})();

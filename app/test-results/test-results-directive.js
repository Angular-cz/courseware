(function() {
  angular.module('ngCzCourseWare')
    .directive('tests', testsDirective);

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
        todo: '@'
      },
      controller: testsDirectiveController,
      controllerAs: 'tests'
    };

    function testsDirectiveController($scope, testResults, $stateParams) {

      /**
       * Load test results of this block
       */
      this.actualizeResults_ = function() {
        var loader = testResults.getResultsLoader($stateParams.name);
        this.results = loader.getResultsFor(this.todo);
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

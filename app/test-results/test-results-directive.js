(function() {
  angular.module('ngCzCourseWare')
    .directive('tests', testsDirective);

  function testsDirective(testResults) {
    return {
      restrict: 'E',
      scope: {
        todo: '@'
      },
      templateUrl: "directive-tests",
      link: function(scope) {
        var loader = testResults.getResultsLoaderByRoute();
        scope.results = loader.getResultsFor(scope.todo);

        scope.$on('todo:actualized', function() {
          scope.results = loader.getResultsFor(scope.todo);
        });

        scope.isPassed = function() {
          return scope.results && scope.results.passed === scope.results.total;
        }
      }
    }
  }
})();

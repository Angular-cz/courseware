(function() {
  angular.module('ngCzCourseWare')
    .directive('pagination', paginationDirective)
    .directive('note', noteDirective)
    .directive('snippet', snippetDirective)
    .directive('solution', solutionDirective);

  function paginationDirective() {
    return {
      restrict: "E",
      templateUrl: "directive-pagination",
      scope:{},
      controller: function(todoLoader, $stateParams) {
        this.current = $stateParams.name;

        this.prev = todoLoader.getPrev(this.current);
        this.next = todoLoader.getNext(this.current);
      },
      controllerAs: "pagination"
    }
  }

  function solutionDirective() {
    return {
      restrict: "E",
      templateUrl: "directive-solution",
      transclude: true,
      scope: true,
      link: function(scope, elem, attrs) {
        if (attrs.hasOwnProperty('visible')) {
          scope.visible = true;
        }

        scope.highlight = 'javascript';
        if (attrs.hasOwnProperty('html')) {
          scope.highlight = 'html';
        }

        scope.toggle = function() {
          scope.visible = !scope.visible;
        }
      }
    }
  }

  function snippetDirective() {
    return {
      restrict: "E",
      templateUrl: "directive-snippet",
      transclude: true,
      scope: true,
      link: function(scope, elem, attrs) {
        scope.highlight = 'javascript';

        if (attrs.hasOwnProperty('html')) {
          scope.highlight = 'html';
        }
      }
    }
  }

  function noteDirective() {
    return {
      restrict: "E",
      templateUrl: "directive-note",
      transclude: true,
      scope: true,
      link: function(scope, elem, attrs) {
        if (attrs.hasOwnProperty('visible')) {
          scope.visible = true;
        }

        scope.toggle = function() {
          scope.visible = !scope.visible;
        }
      }
    }
  }
})();


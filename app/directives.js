(function() {
  angular.module('ngCzCourseWare')
    .directive('pagination', paginationDirective)
    .directive('hint', hintDirective)
    .directive('snippet', snippetDirective)
    .directive('solution', solutionDirective);

  /**
   * Directive for pagination, loads current name of todo from router and shows prev / next buttons when needed
   */
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

  /**
   * Directive contains solution code and show it on demand
   *
   * When attribute visible is introduced, its shown by default
   *
   * TODO integrate highlighter
   * TODO anylyze if visible is still usefull after snippet adition
   */
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

  /**
   * Directive shows code snippet
   *
   * TODO integrate highlighter
   */
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

  /**
   * Directive can contain hint and show it on demand
   *
   * TODO anylyze if visible is still usefull after snippet adition
   */
  function hintDirective() {
    return {
      restrict: "E",
      templateUrl: "directive-hint",
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


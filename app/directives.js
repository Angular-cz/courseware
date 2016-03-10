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

        // first page on intro
        if(!this.next && !this.prev) {
          this.next = todoLoader.getFirst();
        }

        // Intro would not meet the list of todos and will redirect to home
        if(!this.prev && this.current) {
          this.prev = 'Intro';
        }

      },
      controllerAs: "pagination"
    }
  }

  /**
   * Directive contains solution code and show it on demand, or by default, if visible attribute is present
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

        scope.toggle = function() {
          scope.visible = !scope.visible;
        }
      }
    }
  }

  /**
   * Directive shows code snippet
   */
  function snippetDirective() {
    return {
      restrict: "E",
      templateUrl: "directive-snippet",
      transclude: true,
      scope: true
    }
  }

  /**
   * Directive can contain hint and show it on demand, or by default, if visible attribute is present
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


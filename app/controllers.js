(function() {
  angular.module('ngCzCourseWare')
    .controller('TodoCtrl', TodoCtrl)
    .controller('IndexCtrl', IndexCtrl);

  /**
   * Shows particular todo page
   *
   * @param $stateParams
   * @param todoLoader
   * @param $location
   * @param $anchorScroll
   */
  function TodoCtrl($stateParams, todoLoader, $location, $anchorScroll) {
    this.current = $stateParams.name;

    $anchorScroll("top");

    // redirect to homepage if page is not valid
    if (!todoLoader.isValid(this.current)) {
      $location.path('/');
    }

    this.template = 'todo-' + this.current;
  }

  /**
   * Show todos in menu
   *
   * @param todos
   * @constructor
   */
  function IndexCtrl(todos) {
    this.todos = todos;
  }
})();
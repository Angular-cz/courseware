(function() {
  angular.module('ngCzCourseWare')
    .controller('TodoCtrl', TodoCtrl)
    .controller('IndexCtrl', IndexCtrl);

  function TodoCtrl($stateParams, todoLoader, $location, $anchorScroll) {
    this.current = $stateParams.name;

    $anchorScroll("top");

    if (!todoLoader.isValid(this.current)) {
      $location.path('/');
    }

    this.template = 'todo-' + this.current;
  }

  function IndexCtrl(todos) {
    this.todos = todos;
  }
})();
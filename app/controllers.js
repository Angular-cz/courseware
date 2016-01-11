(function() {
  angular.module('ngCzCourseWare')
    .controller('TodoCtrl', TodoCtrl)
    .controller('IndexCtrl', IndexCtrl);

  function TodoCtrl($stateParams, todoLoader, $location, $anchorScroll) {
    var current = $stateParams.name;

    $anchorScroll("top");

    if (!todoLoader.isValid(current)) {
      $location.path('/');
    }

    this.template = 'todo-' + current;
  }

  function IndexCtrl(todos) {
    this.todos = todos;
  }
})();
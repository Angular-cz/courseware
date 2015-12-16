(function() {

  angular.module('ngCzCourseWare', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('todos', {
          url: '/',
          abstract: true,
          templateUrl: 'todos',
          controller: IndexCtrl,
          controllerAs: "vm"
        })

        .state('todos.index', {
          url: '',
          templateUrl: 'intro'
        })
        .state('todos.todo', {
            url: 'todo/:name',

            templateUrl: 'todo',
            controller: TodoCtrl,
            controllerAs: 'todo'
          }
        );
    });

  function TodoCtrl($stateParams, todoLoader, $location, $anchorScroll) {
    this.current = $stateParams.name;

    $anchorScroll("top");

    if (!todoLoader.contains(this.current)) {
      $location.path('/');
    }

    this.template = 'todo-' + this.current;
    this.prev = todoLoader.getPrev(this.current);
    this.next = todoLoader.getNext(this.current);
  }

  function IndexCtrl(todos) {
    this.todos = todos;
  }

})();

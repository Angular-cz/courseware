(function() {

  angular.module('ngCzCourseWare', [
      'ui.router',
      'btford.socket-io'
    ])
    .config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('todos', {
          url: '/',
          abstract: true,
          templateUrl: 'todos',
          controller: 'IndexCtrl',
          controllerAs: "vm"
        })

        .state('todos.index', {
          url: '',
          templateUrl: 'intro'
        })

        .state('todos.todo', {
            url: 'todo/:name',
            templateUrl: 'todo',
            controller: 'TodoCtrl',
            controllerAs: 'todo'
          }
        );
    });
})();

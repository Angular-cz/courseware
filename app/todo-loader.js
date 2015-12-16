(function() {
  angular.module('ngCzCourseWare')
    .service('todoLoader', TodoLoader);

  function TodoLoader($http, todos) {

    this.todos = todos;

    this.loadTodos = function() {
      return $http.get('todos.json')
        .then(function(response) {
          return response.data;
        })
    };

    this.contains = function(todo) {
      return this.todos.indexOf(todo) > -1;
    };

    this.getTodos = function() {
      return this.todos;
    };

    this.getNext = function(todo) {
      if (!this.contains(todo)) {
        return;
      }
      var index = this.todos.indexOf(todo);
      return this.todos[index + 1];
    };

    this.getPrev = function(todo) {
      if (!this.contains(todo)) {
        return;
      }
      var index = this.todos.indexOf(todo);
      return this.todos[index - 1];
    }
  }

})();
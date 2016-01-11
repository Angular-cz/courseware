(function() {
  angular.module('ngCzCourseWare')
    .service('todoLoader', TodoLoader);

  function TodoLoader(todos) {

    this.todos = todos;

    this.isValid = function(todo) {
      return this.todos.indexOf(todo) > -1;
    };

    this.getNext = function(todo) {
      if (!this.isValid(todo)) {
        return;
      }
      var index = this.todos.indexOf(todo);
      return this.todos[index + 1];
    };

    this.getPrev = function(todo) {
      if (!this.isValid(todo)) {
        return;
      }
      var index = this.todos.indexOf(todo);
      return this.todos[index - 1];
    }
  }
})();
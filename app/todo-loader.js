(function() {
  angular.module('ngCzCourseWare')
    .service('todoLoader', TodoLoader);

  // TODO discuss if shouldn't gather current automatically - then possible rename to paginator
  // TODO provider with todos instead of dependency
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
    };

    this.getFirst = function() {
      return this.todos[0];
    }
  }
})();

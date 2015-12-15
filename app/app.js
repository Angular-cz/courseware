// TODO separate into multiple files

var TodoCtrl = function($stateParams, todos, $location, $anchorScroll) {
  this.current = $stateParams.name;

  $anchorScroll("top");

  if (!todos.contains(this.current)) {
    $location.path('/');
  }

  this.template = 'todo-' + this.current;
  this.prev = todos.getPrev(this.current);
  this.next = todos.getNext(this.current);
};

var IndexCtrl = function(todos) {
  this.todos = todos.getTodos();
};

//TODO check if todos are nonaccessile
// IT should be configurale or inlined
var TodoLoader = function($http) {
  var todos = [];

  this.initialize = function() {
    return this.loadTodos()
      .then(function(todos) {
        this.todos = todos;
        return this;
      }.bind(this));
  }

  // TODO should be configurale or inlined

  this.loadTodos = function() {
    return $http.get('todos.json')
      .then(function(response) {
        return response.data;
      })
  }

  this.contains = function(todo) {
    return this.todos.indexOf(todo) > -1;
  }

  this.getTodos = function() {
    return this.todos;
  }

  this.getNext = function(todo) {
    if (!this.contains(todo)) {
      return;
    }
    var index = this.todos.indexOf(todo);
    return this.todos[index + 1];
  }
  this.getPrev = function(todo) {
    if (!this.contains(todo)) {
      return;
    }
    var index = this.todos.indexOf(todo);
    return this.todos[index - 1];
  }
}

function paginationDirective() {
  return {
    restrict: "E",
    templateUrl: "directive-pagination"
  }
}

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

function noteDirective() {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "directive-note",
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

function TestsResults($stateParams) {
  var TMP = {
    "TimeoutPromise je definována jako funkce (TODO 1.1)": {
      "se dvěma parametry": "PASSED",
      "která vrací promise": "FAILED"
    },
    "TimeoutPromise": {
      "hodnota je stejná jako návratová hodnota conditionFunction (TODO 1.2)": "FAILED",
      "pokud funkce vrátí null je promise rejected (TODO 1.3)": "FAILED"
    },
    "TimeoutPromise conditionFunction": {
      "je volána s definovaným zpožděním (TODO 1.4)": "FAILED"
    }
  };

  // todo reaction to socket - fills data
  // todo possibility to get service for routename

  // todo initial load return promise and fill object
  this.loadInitialData = function() {
    this.lastResults = this.getFlattened(TMP);
  }

  this.getResultsFor = function(todo) {
    if (!this.lastResults) {
      this.loadInitialData();
    }

    var tests = this.getLinesFor(todo);

    var result = {};
    result.total = tests.length;
    result.passed = tests.filter(function(item) {
      return item.type === "PASSED";
    }).length;

    result.tests = tests;

    return result;
  }

  this.getLinesFor = function(todo) {

    // todo return promise
    return this.lastResults.filter(function(item) {
      var todoName = '(TODO ' + todo + ')';
      return item.name.indexOf(todoName) > -1
    });
  }

  this.getFlattened = function(data) {

    function Item(name, type) {
      this.name = name;
      this.type = type;
    }

    // TODO - refactor, it is midnight coding - functional - but uggly (but you have tests)
    function parseData(data, prefix) {
      prefix = (prefix) ? prefix + ' ' : '';

      for (var key in data) {
        var value = data[key];
        var name = prefix + key;

        if (typeof value === "object") {
          parseData(value, name)
        } else {
          result.push(new Item(name, data[key]));
        }

      }
    }

    var result = [];

    parseData(data, '');

    return result;
  }
}

function testsDirective(testResults) {
  return {
    restrict: 'E',
    scope: {
      todo: '@'
    },
    templateUrl: "directive-tests",
    link: function(scope) {
      scope.results = testResults.getResultsFor(scope.todo);

      scope.isPassed = function() {
        return scope.results.passed === scope.results.total;
      }
    }

  }
}

angular.module('js-todo', ['ui.router'])
  .service('todoLoader', TodoLoader)
  .service('testResults', TestsResults)
  .directive('pagination', paginationDirective)
  .directive('note', noteDirective)
  .directive('solution', solutionDirective)
  .directive('tests', testsDirective)
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('todos', {
        url: '/',
        abstract: true,
        templateUrl: 'todos',
        controller: IndexCtrl,
        controllerAs: "vm",

        resolve: {
          todos: function(todoLoader) {
            return todoLoader.initialize();
          }
        }
      })
      .state('todos.index', {
        url: '',
        templateUrl: 'intro',
      })
      .state('todos.todo', {
          url: 'todo/:name',

          templateUrl: 'todo',
          controller: TodoCtrl,
          controllerAs: 'todo'
        }
      );
  });

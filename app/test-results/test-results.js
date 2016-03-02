(function() {
  angular.module('ngCzCourseWare')
    .service('testResults', TestsResults)
    .provider('socketConnector', SocketConnector);

  /**
   * Connector to socket server
   */
  function SocketConnector() {

    var url;

    /**
     * Set url of socket server
     *
     * @param newUrl
     */
    this.setUrl = function(newUrl) {
      url = newUrl;
    };

    this.$get = function(socketFactory) {
      if (typeof io !== 'undefined' && url) {
        var myIoSocket = io.connect(url);

        var socket = socketFactory({
          ioSocket: myIoSocket
        });
      }

      // if there is no socket, then create empty object
      if (!socket) {
        return {
          requestTestResults : function() {},
          onActualization : function() {}
        };
      }

      return {
        /**
         * Send request for test results, it is return through ordinary actualization
         *
         * @param todoName
         */
        requestTestResults: function(todoName) {
          socket.emit('resultRequest', todoName)
        },

        /**
         * Register onActualization callback
         *
         * @param callback
         */
        onActualization: function(callback) {
          socket.on('testResults', callback);
        }
      }
    }
  }

  /**
   * Construction function of particular test results loader
   *
   * Its created for every exercise and holds current data, it provides integration for parser with method getResultsFor(todo)
   *
   * @param testResultsParser
   */
  function TestResultsLoader(testResultsParser) {
    this.setResults = function(data) {
      this.lastResults = testResultsParser.getFlattened(data);
    };

    /**
     * Search for results of given todo (TODO 1.2) ...
     * @param todo
     * @param exact
     */
    this.getResultsFor = function(todo, exact) {
      if (!this.lastResults) {
        return;
      }

      return testResultsParser.getResultsFor(this.lastResults, todo, exact);
    };

    /**
     * Search for results without todo
     */
    this.getResultsWithoutTodo = function() {
      if (!this.lastResults) {
        return;
      }

      return testResultsParser.getResultsWithoutTodo(this.lastResults);
    };

  }

  /**
   * Factory for creating result loaders on demand, when there is exercise with tests,
   * cache of loaders is checked for particular loaader, otherwise its created.
   *
   *
   */
  function TestsResults($rootScope, socketConnector, $injector) {

    this.resultLoaders = {};

    /**
     * Get result loader for particular exerciseName,
     * if its not in cache, creates new one and send request for test results, for loader to have data
     *
     * @param exerciseName
     * @returns TestResultLoader instance
     */
    this.getResultsLoader = function(exerciseName) {
      if (!this.resultLoaders[exerciseName]) {

        socketConnector.requestTestResults(exerciseName);
        this.resultLoaders[exerciseName] = $injector.instantiate(TestResultsLoader);
      }

      return this.resultLoaders[exerciseName];
    };

    /**
     * Callback for registration to socket connector on incoming test results
     * Tests results are passed to particular loader
     *
     * TODO there is possibility for data to be loaded twice, if loader is not in cache,
     * its both created with request for data and filled with incoming results
     *
     * @param message
     * @private
     */
    this.actualizeData_ = function(message) {
      var loader = this.getResultsLoader(message.exercise);
      console.log('Actualization of todo:' + message.exercise);
      loader.setResults(message.data || {});


      $rootScope.$broadcast('todo:actualized');
    };

    // register on socketConnector actualization of test results
    socketConnector.onActualization(this.actualizeData_.bind(this));
  }
})();

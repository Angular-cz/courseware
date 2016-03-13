// Karma configuration
// Generated on Tue Nov 17 2015 01:31:21 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    frameworks: ['jasmine', 'angular-filesort'],
    files: [],

    exclude: [
      'karma.conf.js'
    ],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-story-reporter',
      'karma-angular-filesort'
    ],

    reporters: ['progress'],

    storyReporter: {
      showSkipped: true,
      showSkippedSummary: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,

    files: [
      'bower_components/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-socket-io/socket.min.js',
      'app/**/*.js'
    ],
    angularFilesort: {
      whitelist: [
        'app/**/*.js'
      ]
    }
  });
};

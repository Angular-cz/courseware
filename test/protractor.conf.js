exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '*.spec.js'
  ],
  capabilities: {
    'browserName': process.env.PROTR_BROWSER || 'chrome'
  },
  baseUrl: 'http://localhost:8080/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};

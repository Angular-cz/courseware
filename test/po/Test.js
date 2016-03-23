function Test(todo) {
  this.testsElement = element(by.css('tests[todo="' + todo + '"] .tests'));

  this.getSummary = function() {
    return this.testsElement.element(by.css('.pull-right')).getText();
  };

  this.getResult = function() {
    return this.testsElement.element(by.css('ul')).getText();
  };

  this.getLog = function() {
    return this.testsElement.element(by.css('.log')).getText();
  };

  this.getClassNames = function() {
    return this.testsElement.getAttribute('class');
  };

  this.getFirstResultClassNames = function() {
    return this.getResult().element(by.css('li')).getAttribute('class');
  };

  this.isSlow = function() {
    return this.getResult().element(by.css('.slow-test-warning')).isDisplayed();
  };

}

function TestExists(todo) {
  this.testsElement = element(by.css('tests-exists[todo="' + todo + '"] .tests-exists'));

  this.getClassNames = function() {
    return this.testsElement.getAttribute('class');
  };

  this.getText = function() {
    return this.testsElement.getText();
  }
}


function TestResults() {
  this.testsElement = element(by.css('tests-results .tests-results'));

  this.getTitle = function() {
    return this.testsElement.element(by.css('.panel-title')).getText();
  };

  this.getTestsCount = function() {
    return this.testsElement.all(by.css('.tests ul li')).count();
  };
}

module.exports = {
  getTestForTodo: function(todo) {
    return new Test(todo);
  },
  getTestExistsForTodo: function(todo) {
    return new TestExists(todo);
  },
  getTestResults: function() {
    return new TestResults();
  }
};

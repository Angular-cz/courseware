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

module.exports = {
  getTestForTodo: function(todo) {
    return new Test(todo);
  }
};

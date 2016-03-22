var ExercisePO = require('./po/Exercise');
var testHelper = require('./po/Test');
var EC = protractor.ExpectedConditions;

function waitForContent(element, text) {
  browser.wait(EC.textToBePresentInElement(element, text), 5000);
}

describe('Courseware component test', function() {
  beforeEach(function() {
    this.exercisePO = new ExercisePO('02-second');
    this.exercisePO.go();
  });

  it('first test passed', function() {
    var test = testHelper.getTestForTodo('1');
    expect(test.getClassNames()).toContain('passed');
    expect(test.getSummary()).toContain('1 / 1 passed');
    expect(test.getResult()).toContain('test passed (TODO 1)');
  });

  it('second test failed', function() {
    var test = testHelper.getTestForTodo('2');
    expect(test.getClassNames()).toContain('failed');
    expect(test.getSummary()).toContain('0 / 1 passed');
    expect(test.getResult()).toContain('test failed (TODO 2)');
    expect(test.getLog()).toContain('log content');
  });

  it('third test is skipped', function() {
    var test = testHelper.getTestForTodo('3');
    expect(test.getClassNames()).toContain('failed');
    expect(test.getFirstResultClassNames()).toContain('skipped');

    var summary = test.getSummary();
    expect(summary).toContain('0 / 1 passed');
    expect(summary).toContain('1 skipped');

    expect(test.getResult()).toContain('test skipped (TODO 3)');
  });

  it('four test passed, but is slow', function() {
    var test = testHelper.getTestForTodo('4');
    expect(test.getClassNames()).toContain('passed');
    expect(test.isSlow()).toBeTruthy();
  });

  it('five test passed, but is contains no expectation warning', function() {
    var test = testHelper.getTestForTodo('5');
    expect(test.getClassNames()).toContain('passed');

    var result = test.getResult();
    expect(result).toContain('Test has no expectations!');
    expect(result).toContain('test passed without expectation (TODO 5)');
  });

});

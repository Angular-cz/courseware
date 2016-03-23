var ExercisePO = require('./po/Exercise');
var testHelper = require('./po/Test');

describe('Courseware component', function() {
  beforeEach(function() {
    this.exercisePO = new ExercisePO('02-second');
    this.exercisePO.go();
  });

  describe('test', function() {

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

  describe('test-exists', function() {
    it('todo 1 exists', function() {
      var testExists = testHelper.getTestExistsForTodo('1');
      expect(testExists.getClassNames()).toContain('passed');
      expect(testExists.getText()).toContain('Tests for TODO 1 exists');
    });

    it('todo 11 does not exists', function() {
      var testExists = testHelper.getTestExistsForTodo('11');
      expect(testExists.getClassNames()).toContain('failed');
      expect(testExists.getText()).toContain('No tests for TODO 11');
    });
  });

  describe('test-result', function() {
    beforeEach(function() {
      this.testResult = testHelper.getTestResults();
    });

    it('should fail', function() {
      expect(this.testResult.getTitle()).toBe(' Some tests failed!')
    });

    it('should contain all 5 tests', function() {
      expect(this.testResult.getTestsCount()).toBe(5);
    });

  });

});

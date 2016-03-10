var ExercisePO = require('./po/Exercise');
var HintPO = require('./po/Hint');
var SolutionPO = require('./po/Solution');
var EC = protractor.ExpectedConditions;

function waitForContent(element, text) {
  browser.wait(EC.textToBePresentInElement(element, text), 5000);
}

describe('Courseware component', function() {
  beforeEach(function() {
    this.exercisePO = new ExercisePO('01-first');
    this.exercisePO.go();
  });

  describe('tests', function() {
    beforeEach(function() {
      this.todo01 = this.exercisePO.getTests(1);
    });

    it('contains test name', function() {
      this.todo01.writeResult({
        "test name (TODO 1)": {
          "status": "FAILED"
        }
      });

      waitForContent(this.todo01.element, 'test name (TODO 1)');
    });

    it('informs about missing test', function() {
      this.todo01.writeResult({});

      waitForContent(this.todo01.element, 'No tests for TODO 1');
      waitForContent(this.todo01.results, '0 / 0');
    });

    it('supports failed test', function() {
      this.todo01.writeResult({
        "test(TODO 1)": {
          "status": "FAILED"
        }
      });

      waitForContent(this.todo01.results, '0 / 1');
    });

    it('supports passed test', function() {

      this.todo01.writeResult({
        "test(TODO 1)": {
          "status": "PASSED"
        }
      });

      waitForContent(this.todo01.results, '1 / 1');
    });

    it('supports pending test', function() {

      this.todo01.writeResult({
        "test(TODO 1)": {
          "status": "SKIPPED"
        }
      });

      waitForContent(this.todo01.results, 'skipped');
    });
  });

  describe('hint', function() {
    beforeEach(function() {
      this.hint = new HintPO();
    });

    it('should be hidden by default', function() {
      expect(this.hint.isOpened()).toBe(false);
    });

    it('can be opened', function() {
      this.hint.open();
      expect(this.hint.isOpened()).toBe(true);
    });
  });

  describe('solution', function() {

    beforeEach(function() {
      this.solution = new SolutionPO();
    });

    it('should be hidden by default', function() {
      expect(this.solution.isOpened()).toBe(false);
    });

    it('can be opened', function() {
      this.solution.open();
      expect(this.solution.isOpened()).toBe(true);
    });
  });
});

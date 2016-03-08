var ExercisePO = require('./po/Exercise.po');
var HintPO = require('./po/Hint.po');
var SolutionPO = require('./po/Solution.po');

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
        "test(TODO 1)": {
          "status": "FAILED"
        }
      });

      var firstRow = this.todo01.element.all(by.css('li')).first();
      expect(firstRow.getText()).toMatch('TODO 1');

    });

    it('informs about missing test', function() {
      this.todo01.writeResult({});

      var content = this.todo01.element.getText();
      expect(content).toMatch('No tests for TODO 1');
      expect(this.todo01.getTestResults()).toMatch('0 / 0');
    });

    it('supports failed test', function() {
      this.todo01.writeResult({
        "test(TODO 1)": {
          "status": "FAILED"
        }
      });

      expect(this.todo01.getTestResults()).toMatch('0 / 1');
    });

    it('supports passed test', function() {

      this.todo01.writeResult({
        "test(TODO 1)": {
          "status": "PASSED"
        }
      });

      expect(this.todo01.getTestResults()).toMatch('1 / 1');
    });

    it('supports pending test', function() {

      this.todo01.writeResult({
        "test(TODO 1)": {
          "status": "SKIPPED"
        }
      });

      expect(this.todo01.getTestResults()).toMatch('skipped');
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

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

      var result = {
        "test(TODO 1)": {
          "status": "FAILED"
        }
      };

      this.todo01.writeResult(result);

      var firstRow = this.todo01.element.all(by.css('li')).first();
      expect(firstRow.getText()).toMatch('TODO 1');

    });

    it('contains failed test', function() {

      var result = {
        "test(TODO 1)": {
          "status": "FAILED"
        }
      };

      this.todo01.writeResult(result);

      expect(this.todo01.getTestResults()).toMatch('0 / 1');
    });

    it('contains passed test', function() {

      var result = {
        "test(TODO 1)": {
          "status": "PASSED"
        }
      };

      this.todo01.writeResult(result);

      expect(this.todo01.getTestResults()).toMatch('1 / 1');
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

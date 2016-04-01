var CourseWarePO = require('./po/Courseware');
var ExercisePO = require('./po/Exercise');

describe('Courseware', function() {

  describe('homepage', function() {

    beforeAll(function() {
      this.po = new CourseWarePO();
      this.po.go();
    });

    it('should have a title', function() {
      expect(this.po.getMainTitle()).toBe('CourseWare test title');
    });

    it('should have a intro rendered', function() {
      expect(this.po.getIntroTitle()).toBe('Intro title');
    });

    it('should contain version', function() {
      var currentVersion = require('../package.json').version;
      expect(this.po.getFooterText()).toMatch(currentVersion);
    });
  });

  describe('menu', function() {
    var exercises;
    beforeEach(function(done) {

      this.po = new CourseWarePO();
      this.po.go();

      this.po.getMenuItems()
        .then(function(items) {
          exercises = items;
          done();
        });
    });

    it('should have two exercises', function() {
      expect(exercises[0] && exercises[0].getTitle()).toBe('01-first');
      expect(exercises[1] && exercises[1].getTitle()).toBe('02-second');
    });

    it('should redirect to detail of item', function() {
      var exercise = exercises[0];
      var exercisePO = exercise.go();

      expect(browser.getLocationAbsUrl()).toMatch('01-first');
      expect(exercisePO.getTitle()).toMatch('01-first');
    });
  });

  describe('exercise page', function() {
    beforeEach(function() {
      this.exercisePO = new ExercisePO('01-first');
      this.exercisePO.go();
    });

    it('should have title', function() {
      expect(this.exercisePO.getTitle()).toMatch('01-first');
    });

    it('should have content', function() {
      expect(this.exercisePO.content.getInnerHtml()).toMatch('content of first exercise');
    });
  });
});

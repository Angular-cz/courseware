
var CourseWarePO = require('./po/Courseware.po');
var ExercisePO = require('./po/Exercise.po');
var HintPO = require('./po/Hint.po');
var SolutionPO = require('./po/Solution.po');

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

  describe('pagination', function() {
    describe('on first page', function() {
      beforeEach(function() {
        this.exercisePO = new ExercisePO('01-first');
        this.exercisePO.go();
        this.pagination = this.exercisePO.getPagination();
      });

      it('should have link to next exercise', function() {
        expect(this.pagination.getNextTitle()).toMatch('02-second');
      });
    });

    describe('on second page', function() {
      beforeEach(function() {
        this.exercisePO = new ExercisePO('02-second');
        this.exercisePO.go();
        this.pagination = this.exercisePO.getPagination();
      });

      it('should have link to next exercise', function() {
        expect(this.pagination.getNextTitle()).toMatch('03-third');
      });

      it('should be able to go to next item', function() {
        this.pagination.goNext();
        expect(browser.getLocationAbsUrl()).toMatch('03-third');
      });

      it('should have link to previous exercise', function() {
        expect(this.pagination.getPrevTitle()).toMatch('01-first');
      });

      it('should be able to go to previous item', function() {
        this.pagination.goPrev();
        expect(browser.getLocationAbsUrl()).toMatch('01-first');
      });
    });

    describe('on last page', function() {
      beforeEach(function() {
        this.exercisePO = new ExercisePO('03-third');
        this.exercisePO.go();
        this.pagination = this.exercisePO.getPagination();
      });

      it('should have link to previous exercise', function() {
        expect(this.pagination.getPrevTitle()).toMatch('02-second');
      });

      it('should not have link to next exercise', function() {
        expect(this.pagination.nextLink.isPresent()).toBe(false);
      });
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

  describe('component', function(){
    beforeEach(function() {
      this.exercisePO = new ExercisePO('01-first');
      this.exercisePO.go();
    });

    describe('hint', function(){
      beforeEach(function() {
        this.hint = new HintPO();
      });

      it('should be hidden by default', function(){
        expect(this.hint.isOpened()).toBe(false);
      });

      it('can be opened', function() {
        this.hint.open();
        expect(this.hint.isOpened()).toBe(true);
      });
    });

    describe('solution', function(){

      beforeEach(function() {
        this.solution = new SolutionPO();
      });

      it('should be hidden by default', function(){
        expect(this.solution.isOpened()).toBe(false);
      });

      it('can be opened', function() {
        this.solution.open();
        expect(this.solution.isOpened()).toBe(true);
      });
    });
  });
});

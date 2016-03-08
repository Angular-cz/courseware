var ExercisePO = require('./po/Exercise.po');

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

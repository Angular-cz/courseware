var ExercisePO = require('./Exercise.po');

module.exports = function PaginationComponent(element) {
  this.element = element;
  this.nextLink = this.element.element(by.binding('pagination.next'));
  this.prevLink = this.element.element(by.binding('pagination.prev'));

  this.getNextTitle = function() {
    return this.nextLink.getAttribute('text');
  };

  this.goNext = function() {
    this.nextLink.click();

    return new ExercisePO();
  };

  this.getPrevTitle = function() {
    return this.prevLink.getAttribute('text');
  };

  this.goPrev = function() {
    this.prevLink.click();

    return new ExercisePO();
  };
};

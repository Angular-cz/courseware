
function ExercisePO(exerciseName) {

  this.exerciseName = exerciseName;
  this.title = element(by.binding('todo.current'));
  this.pagination = element.all(by.css('pagination')).last();
  this.content = element(by.css('ng-include'));

  this.go = function() {
    browser.get('/#/todo/' + this.exerciseName);
  };
  this.getTitle = function() {
    return this.title.getText();
  };

  this.getPagination = function() {
    return new PaginationComponent(this.pagination);
  }
}

module.exports = ExercisePO;

function PaginationComponent(element) {
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
}

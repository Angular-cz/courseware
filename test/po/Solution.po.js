module.exports = function SolutionPO() {
  this.solution = element(by.css('solution'));
  this.link = this.solution.element(by.css('a'));
  this.content = this.solution.element(by.css('#solution-content'));

  this.open = function() {
    this.link.click();
  };

  this.isOpened = function() {
    return this.content.isPresent();
  }
};

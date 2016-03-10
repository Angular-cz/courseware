module.exports = function HintPO() {
  this.hint = element(by.css('hint'));
  this.link = this.hint.element(by.css('a'));
  this.content = this.hint.element(by.css('#hint-content'));

  this.open = function() {
    this.link.click();
  };

  this.isOpened = function() {
    return this.content.isPresent();
  }
};

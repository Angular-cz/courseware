var ExercisePO = require('./Exercise');
var PaginationComponent = require('./Pagination');

module.exports = function CourseWarePO() {
  this.title = element(by.css('a.navbar-brand'));
  this.introTitle = element(by.css('div.main > h2'));
  this.menuItems = element.all(by.repeater('todo in vm.todos').column('todo'));
  this.pagination = element.all(by.css('pagination')).last();

  this.go = function() {
    browser.get('/');
  };

  this.getMainTitle = function() {
    return this.title.getText();
  };

  this.getIntroTitle = function() {
    return this.introTitle.getText();
  };

  this.getMenuItems = function() {
    function createMenuItem(item) {
      return new MenuItem(item);
    }

    return this.menuItems
      .then(function(items) {
        return items.map(createMenuItem);
      });
  };

  this.getPagination = function() {
    return new PaginationComponent(this.pagination);
  };
};

function MenuItem(item) {
  this.item = item;
  this.getTitle = function() {
    return this.item.getText();
  };

  this.go = function() {
    this.item.click();
    return new ExercisePO();
  };
}

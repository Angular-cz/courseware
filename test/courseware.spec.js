var rootUrl = 'http://localhost:8080/';

function CourseWarePO() {
  this.title = element(by.css('a.navbar-brand'));
  this.introTitle = element(by.css('div.main > h2'));
  this.menuItems = element.all(by.repeater('todo in vm.todos').column('todo'));

  this.go = function() {
    browser.get(rootUrl);
  };

  this.getMainTitle = function() {
    return this.title.getText();
  };

  this.getIntroTitle = function() {
    return this.introTitle.getText();
  };

  this.getMenuItems = function() {
    return this.menuItems.map(function(item) {
      return new MenuItem(item);
    });
  }
}

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

function ExercisePO(exerciseName) {

  this.exerciseName = exerciseName;
  this.title = element(by.binding('todo.current'));
  this.pagination = element.all(by.css('pagination')).last();
  this.content = element(by.css('ng-include'));

  this.go = function() {
    browser.get(rootUrl + '#/todo/' + this.exerciseName);
  };
  this.getTitle = function() {
    return this.title.getText();
  };

  this.getPagination = function() {
    return new PaginationComponent(this.pagination);
  }
}

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
        .then(function(menuItems) {
          exercises = menuItems;

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
        var exercisePO = this.pagination.goNext();
        expect(browser.getLocationAbsUrl()).toMatch('03-third');
      });

      it('should have link to previous exercise', function() {
        expect(this.pagination.getPrevTitle()).toMatch('01-first');
      });

      it('should be able to go to previous item', function() {
        var exercisePO = this.pagination.goPrev();
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

});

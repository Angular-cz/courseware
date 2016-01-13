describe('testResultsParser service', function() {

  beforeEach(module('ngCzCourseWare'));
  beforeEach(inject(function(testResultsParser) {
    this.testResultsParser = testResultsParser;
  }));

  it('should be defined', function() {
    expect(this.testResultsParser).toBeDefined();
  });

  describe('method getResultsFor', function() {
    it('returns lines for given todo number', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'}
      ];

      var results = this.testResultsParser.getResultsFor('1.1', testResults);
      expect(results.total).toBe(1);
      expect(results.tests[0].name).toMatch('first');
    });

    it('returns multiple lines for given todo number', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'third (TODO 1.1)'}
      ];

      var results = this.testResultsParser.getResultsFor('1.1', testResults);
      expect(results.total).toBe(2);
      expect(results.tests[0].name).toMatch('first');
      expect(results.tests[1].name).toMatch('third');
    });

    it('returns lines for multiple todo numbers', function() {
      pending();
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'nono (TODO 1.3)'}
      ];

      var results = this.testResultsParser.getResultsFor('1.1,1.2', testResults);
      expect(results.total).toBe(2);
      expect(results.tests[0].name).toMatch('first');
      expect(results.tests[1].name).toMatch('second');
    });

  });

  describe('method getFlattened', function() {
    it('returns array', function() {
      var result = this.testResultsParser.getFlattened();
      expect(Array.isArray(result)).toBeTruthy();
    });

    it('returns objects', function() {
      var error = {
        "first": "PASSED"
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(typeof result[0]).toBe("object");
      expect(result[0].name).toBe("first");
    });

    it('returns multiple lines', function() {
      var error = {
        "first": "PASSED",
        "second": "PASSED"
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].name).toBe("first");
      expect(result[1].name).toBe("second");
    });

    it('returns objects with type', function() {
      var error = {
        "first": "PASSED",
        "second": "FAILED",
        "pending": "PENDING"

      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].type).toBe("PASSED");
      expect(result[1].type).toBe("FAILED");
      expect(result[2].type).toBe("PENDING");
    });

    it('returns nonpassed objects', function() {
      var error = {
        "first": "FAILED"
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].pass).toBeFalsy();
    });

    it('flattens sentence', function() {
      var error = {
        "first": {
          second: "FAILED"
        }
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].name).toBe("first second");
    });

    it('flattens multi level sentence', function() {
      var error = {
        "first": {
          second: {
            third: {
              fourth: {
                fifth: "FAILED"
              }
            }
          }
        }
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].name).toBe("first second third fourth fifth");
    });

    it('flattens multiple different level sentences', function() {
      var error = {
        "first": {
          second: {
            third: {
              fourth: {
                fifth: "FAILED",
                sixth: "PASSED"
              },
              seventh: "PASSED"

            }
          }
        }
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].name).toBe("first second third fourth fifth");
      expect(result[1].name).toBe("first second third fourth sixth");
      expect(result[2].name).toBe("first second third seventh");
    });
  });

  describe('method getAllResults', function() {
    it('returns all lines', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'third'}
      ];

      var results = this.testResultsParser.getResultsFor(undefined, testResults);
      expect(results.total).toBe(3);
    });

  });

  describe('method getResultsWithoutTodo', function() {
    it('returns all lines', function() {
      var testResults = [
        {name: 'first'},
        {name: 'second (TODO 1.2)'},
        {name: 'third'},
        {name: 'fourth (TODO 4.1)'}
      ];

      var results = this.testResultsParser.getResultsWithoutTodo(testResults);
      expect(results.total).toBe(2);
    });
  });

  describe('method getFilterFor', function() {
    it('filter for one item', function() {

      var test = this.testResultsParser.getFilterFor_('1.1');
      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('other text without todo (TODO 1.2)')).toBe(false);

    });

    it('filter for all', function() {

      var test = this.testResultsParser.getFilterFor_();
      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('other text without todo (TODO 1.2)')).toBe(true);
      expect(test('other text without todo')).toBe(true);

    });


    it('filter for multiple items', function() {

      var test = this.testResultsParser.getFilterFor_('1.1,2.1');
      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('other text without todo (TODO 1.2)')).toBe(false);
      expect(test('other text without todo (TODO 1.3)')).toBe(false);

      expect(test('some text with todo (TODO 2.1)')).toBe(true);
      expect(test('other text without todo (TODO 2.2)')).toBe(false);
      expect(test('other text without todo (TODO 2.3)')).toBe(false);

    });

  });
});

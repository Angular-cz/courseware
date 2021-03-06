describe('testResultsParser service', function() {

  beforeEach(module('ngCzCourseWare'));
  beforeEach(inject(function(testResultsParser) {
    this.testResultsParser = testResultsParser;
  }));

  it('should be defined', function() {
    expect(this.testResultsParser).toBeDefined();
  });

  describe('method getFlattened', function() {
    it('returns array', function() {
      var result = this.testResultsParser.getFlattened();
      expect(Array.isArray(result)).toBeTruthy();
    });

    it('returns object', function() {
      var rawResult = {
        "first": {
          "log": [],
          "time": 12,
          "status": "PASSED"
        }
      };

      var result = this.testResultsParser.getFlattened(rawResult);
      expect(typeof result[0]).toBe("object");
      expect(result[0].name).toBe("first");
      expect(result[0].log).toEqual([]);
      expect(result[0].time).toEqual(12);
      expect(result[0].status).toEqual("PASSED");
    });

    it('returns multiple lines', function() {
      var rawResult = {
        "first": {status: "PASSED"},
        "second": {status: "FAILED"}
      };

      var result = this.testResultsParser.getFlattened(rawResult);
      expect(result[0].name).toBe("first");
      expect(result[1].name).toBe("second");
    });

    it('returns objects with status', function() {
      var rawResult = {
        "first": {status: "PASSED"},
        "second": {status: "FAILED"},
        "pending": {status: "SKIPPED"}

      };

      var result = this.testResultsParser.getFlattened(rawResult);
      expect(result[0].status).toBe("PASSED");
      expect(result[1].status).toBe("FAILED");
      expect(result[2].status).toBe("SKIPPED");
    });

    it('flattens sentence', function() {
      var error = {
        "first": {
          second: {status: "FAILED"}
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
                fifth: {status: "FAILED"}
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
                fifth: {status: "FAILED"},
                sixth: {status: "PASSED"}
              },
              seventh: {status: "PASSED"}

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

  describe('method getResultsFor', function() {
    it('returns lines for given todo number', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'}
      ];

      var results = this.testResultsParser.getResultsFor(testResults, '1.1');
      expect(results.total).toBe(1);
      expect(results.tests[0].name).toMatch('first');
    });

    it('returns multiple lines for given todo number, or hierarchy', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'third (TODO 1.1)'},
        {name: 'fourth (TODO 1.1.1)'}
      ];

      var results = this.testResultsParser.getResultsFor(testResults, '1.1');
      expect(results.total).toBe(3);
      expect(results.tests[0].name).toMatch('first');
      expect(results.tests[1].name).toMatch('third');
      expect(results.tests[2].name).toMatch('fourth');
    });

    it('can be restricted to exact match', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'third (TODO 1.1)'},
        {name: 'fourth (TODO 1.1.1)'}
      ];

      var exact = true;
      var results = this.testResultsParser.getResultsFor(testResults, '1.1', exact);
      expect(results.total).toBe(2);
      expect(results.tests[0].name).toMatch('first');
      expect(results.tests[1].name).toMatch('third');
    });

  });

  describe('method getAllResults', function() {
    it('returns all lines', function() {
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'third'}
      ];

      var results = this.testResultsParser.getResultsFor(testResults);
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
      var test = this.testResultsParser.filterFactory_('1.1');

      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('other text without todo (TODO 1.2)')).toBe(false);

    });

    it('filter for all', function() {
      var test = this.testResultsParser.filterFactory_();

      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('other text without todo (TODO 1.2)')).toBe(true);
      expect(test('other text without todo')).toBe(true);

    });

    it('filter accept hierarchy', function() {
      var test = this.testResultsParser.filterFactory_('1');

      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('some text with todo (TODO 1.1.1)')).toBe(true);
      expect(test('other text without todo (TODO 1.2.1.2)')).toBe(true);
      expect(test('other text without todo (TODO 2.1)')).toBe(false);
    });

    it('filter can be exact', function() {
      var exact = true;
      var test = this.testResultsParser.filterFactory_('1.1', exact);

      expect(test('some text with todo (TODO 1.1)')).toBe(true);
      expect(test('some text with todo (TODO 1.1.1)')).toBe(false);
      expect(test('other text without todo (TODO 1.2.1.2)')).toBe(false);
      expect(test('other text without todo (TODO 2.1)')).toBe(false);
    });

  });
});

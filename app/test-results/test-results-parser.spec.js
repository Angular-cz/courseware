describe('testResultsParser service', function(){

  beforeEach(module('ngCzCourseWare'));
  beforeEach(inject(function(testResultsParser) {
    this.testResultsParser = testResultsParser;
  }));

  it('should be defined', function() {
    expect(this.testResultsParser).toBeDefined();
  });

  describe('method getResultsFor', function(){
    it('returns lines for given todo number', function(){
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'}
      ];

      var results = this.testResultsParser.getLinesFor('1.1', testResults);
      expect(results.length).toBe(1);
      expect(results[0].name).toMatch('first');
    });

    it('returns multiple lines for given todo number', function(){
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'third (TODO 1.1)'}
      ];

      var results = this.testResultsParser.getLinesFor('1.1', testResults);
      expect(results.length).toBe(2);
      expect(results[0].name).toMatch('first');
      expect(results[1].name).toMatch('third');
    });

    it('returns lines for multiple todo numbers', function(){
      pending();
      var testResults = [
        {name: 'first (TODO 1.1)'},
        {name: 'second (TODO 1.2)'},
        {name: 'nono (TODO 1.3)'}
      ];

      var results = this.testResultsParser.getLinesFor('1.1,1.2', testResults);
      expect(results.length).toBe(2);
      expect(results[0].name).toMatch('first');
      expect(results[1].name).toMatch('second');
    });


  });

  describe('method getFlattened', function(){
    it('returns array', function(){
      var result = this.testResultsParser.getFlattened();
      expect(Array.isArray(result)).toBeTruthy();
    });

    it('returns objects', function() {
      var error = {
        "first" : "PASSED"
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(typeof result[0]).toBe("object");
      expect(result[0].name).toBe("first");
    });


    it('returns multiple lines', function() {
      var error = {
        "first" : "PASSED",
        "second" : "PASSED"
      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].name).toBe("first");
      expect(result[1].name).toBe("second");
    });

    it('returns objects with type', function() {
      var error = {
        "first" : "PASSED",
        "second" : "FAILED",
        "pending" : "PENDING"

      };

      var result = this.testResultsParser.getFlattened(error);
      expect(result[0].type).toBe("PASSED");
      expect(result[1].type).toBe("FAILED");
      expect(result[2].type).toBe("PENDING");
    });

    it('returns nonpassed objects', function() {
      var error = {
        "first" : "FAILED"
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
            third : {
              fourth : {
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
            third : {
              fourth : {
                fifth: "FAILED",
                sixth: "PASSED"
              },
              seventh : "PASSED"

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
});

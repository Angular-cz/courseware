describe('testResults service', function() {
  beforeEach(module('ngCzCourseWare'));

  beforeEach(function() {
    this.socketConnector = jasmine.createSpyObj("socketConnector", ['onActualization', 'requestTestResults']);

    module({socketConnector : this.socketConnector});
  });

  beforeEach(inject(function(testResults) {
    this.testResults = testResults;
  }));

  it('should instantiate loader', function() {
    var loader = this.testResults.getResultsLoader('name');
    expect(loader).toBeDefined();
  });

  it('should cache loader', function() {
    var loader = this.testResults.getResultsLoader('name');
    var loader2 = this.testResults.getResultsLoader('name');
    expect(loader).toBe(loader2);
  });

  it('can instantiate loader according to the route', function() {
    inject(function($stateParams) {
      $stateParams.name = '01-basics';
    });

    spyOn(this.testResults, 'getResultsLoader');

    var loader = this.testResults.getResultsLoaderByRoute();
    expect(this.testResults.getResultsLoader).toHaveBeenCalledWith('01-basics');
  });

  it('should register callback on socketConnector', function() {
    expect(this.socketConnector.onActualization).toHaveBeenCalled();
  });

  it('should initialized data', function(){
    var loader = this.testResults.getResultsLoader('42-name');

    expect(this.socketConnector.requestTestResults).toHaveBeenCalledWith('42-name');
  });

  it('should not actualize results on different loader', function(){
    var loader = this.testResults.getResultsLoader('01-to-be-actualized');
    spyOn(loader, 'setResults');

    var actualizationCallback = this.socketConnector.onActualization.calls.mostRecent().args[0];
    actualizationCallback({exercise: "XX-different-exercise"});
    expect(loader.setResults).not.toHaveBeenCalled();
  });
  
  it('should actualize results of specified loader', function(){
    var loader = this.testResults.getResultsLoader('01-to-be-actualized');
    spyOn(loader, 'setResults');

    var actualizationCallback = this.socketConnector.onActualization.calls.mostRecent().args[0];
    actualizationCallback({exercise: "01-to-be-actualized"});
    expect(loader.setResults).toHaveBeenCalled();
  });
});
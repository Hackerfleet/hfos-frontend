'use strict';

describe('Controller: DigitalreadoutCtrl', function () {

  // load the controller's module
  beforeEach(module('hfosFrontendApp'));

  var DigitalreadoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DigitalreadoutCtrl = $controller('DigitalreadoutCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

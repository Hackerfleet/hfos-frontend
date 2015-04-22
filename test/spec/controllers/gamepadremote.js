'use strict';

describe('Controller: GamepadRemoteCtrl', function () {

  // load the controller's module
  beforeEach(module('hfosFrontendApp'));

  var GamepadRemoteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GamepadRemoteCtrl = $controller('GamepadRemoteCtrl', {
      $scope: scope
    });
  }));

  /*it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });*/
});

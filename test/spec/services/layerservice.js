'use strict';

describe('Service: Layerservice', function () {

  // load the service's module
  beforeEach(module('hfosFrontendApp'));

  // instantiate service
  var Layerservice;
  beforeEach(inject(function (_Layerservice_) {
    Layerservice = _Layerservice_;
  }));

  it('should do something', function () {
    expect(!!Layerservice).toBe(true);
  });

});

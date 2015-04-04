'use strict';

describe('Service: MapViewService', function () {

  // load the service's module
  beforeEach(module('hfosFrontendApp'));

  // instantiate service
  var MapViewService;
  beforeEach(inject(function (_MapViewService_) {
    MapViewService = _MapViewService_;
  }));

  it('should do something', function () {
    expect(!!MapViewService).toBe(true);
  });

});

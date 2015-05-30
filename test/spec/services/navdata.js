'use strict';

describe('Service: Navdata', function () {

  // load the service's module
  beforeEach(module('hfosFrontendApp'));

  // instantiate service
  var Navdata;
  beforeEach(inject(function (_Navdata_) {
    Navdata = _Navdata_;
  }));

  it('should do something', function () {
    expect(!!Navdata).toBe(true);
  });

});

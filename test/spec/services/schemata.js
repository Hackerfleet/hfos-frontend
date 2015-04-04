'use strict';

describe('Service: Schemata', function () {

  // load the service's module
  beforeEach(module('hfosFrontendApp'));

  // instantiate service
  var Schemata;
  beforeEach(inject(function (_Schemata_) {
    Schemata = _Schemata_;
  }));

  it('should do something', function () {
    expect(!!Schemata).toBe(true);
  });

});

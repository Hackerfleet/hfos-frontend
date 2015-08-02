'use strict';

describe('Service: Objectproxy', function () {

    // load the service's module
    beforeEach(module('hfosFrontendApp'));

    // instantiate service
    var Objectproxy;
    beforeEach(inject(function (_Objectproxy_) {
        Objectproxy = _Objectproxy_;
    }));

    it('should do something', function () {
        expect(!!Objectproxy).toBe(true);
    });

});

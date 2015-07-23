'use strict';

describe('Controller: WikiCtrl', function () {

    // load the controller's module
    beforeEach(module('hfosFrontendApp'));

    var WikiCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        WikiCtrl = $controller('WikiCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});

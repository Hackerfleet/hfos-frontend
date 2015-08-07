'use strict';

describe('Controller: LogbookCtrl', function () {

    // load the controller's module
    beforeEach(module('hfosFrontendApp'));

    var LogbookCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        LogbookCtrl = $controller('LogbookCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});

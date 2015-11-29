'use strict';

describe('Controller: TaskgridCtrl', function () {

    // load the controller's module
    beforeEach(module('hfosFrontendApp'));

    var TaskgridCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        TaskgridCtrl = $controller('TaskgridCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});

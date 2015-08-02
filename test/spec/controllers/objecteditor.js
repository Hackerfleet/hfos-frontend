'use strict';

describe('Controller: ObjecteditorCtrl', function () {

    // load the controller's module
    beforeEach(module('hfosFrontendApp'));

    var ObjecteditorCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ObjecteditorCtrl = $controller('ObjecteditorCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});

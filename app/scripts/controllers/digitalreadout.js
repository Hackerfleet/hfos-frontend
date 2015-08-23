'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:DigitalreadoutCtrl
 * @description
 * # DigitalreadoutCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('DigitalDashboardCtrl', function ($scope) {
        console.log('[DDBC] Scope: ', $scope.$parent);

        $scope.valuetype = $scope.$parent.valuetype;
        $scope.value = 0;
        $scope.foobar = "HALLO";

        console.log('[DDBC] Scope: ', $scope);

        $scope.$on('hfos.NavdataUpdate', function (event, frame) {
            console.log('[DDBC] My new value is: ', frame[$scope.valuetype]);
            console.log('[DDBC] My key is :', $scope.valuetype);
            console.log('[DDBC] The frame is :', frame);
            $scope.value = frame[$scope.valuetype];
            //$scope.foobar++;
            console.log('[DDBC] New scope :', $scope);
            $scope.$apply();
        });
    });

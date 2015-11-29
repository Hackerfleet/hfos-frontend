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
        $scope.valuetype = $scope.$parent.valuetype;
        $scope.value = 0;

        $scope.$on('hfos.NavdataUpdate', function (event, frame) {
            $scope.value = frame[$scope.valuetype];
            $scope.$apply();
        });
    });

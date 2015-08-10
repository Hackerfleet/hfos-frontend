'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:DigitalreadoutCtrl
 * @description
 * # DigitalreadoutCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('DigitalreadoutCtrl', function ($scope) {
        var key = $scope.$parent.card.value;
        $scope.$on('hfos.NavdataUpdate', function (event, frame) {
            console.log('[DIGIREADOUT] My new value is: ', frame[key]);
            $scope.value = frame[key];
        });
    });

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
        console.log('Hello, i am the digital readout controller, my scope is:', $scope);
        console.log('My value is: ', $scope.$parent.card.value);
    });

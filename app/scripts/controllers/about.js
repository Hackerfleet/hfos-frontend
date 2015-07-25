'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('AboutCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });

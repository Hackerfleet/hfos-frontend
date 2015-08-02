'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:ObjectlistCtrl
 * @description
 * # ObjectlistCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('ObjectlistCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });

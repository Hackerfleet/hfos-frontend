'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
  .controller('LoginCtrl', function ($scope, user) {
    $scope.username = user.username;
    $scope.password = user.password;

    $scope.login = function() {
        console.log('Initiating Login.');
        user.login($scope.username, $scope.password);
    }

    $('#username').focus();
  });

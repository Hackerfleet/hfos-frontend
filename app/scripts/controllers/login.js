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

    $scope.login = function() {
        console.log('Initiating Login.');
        var username = $('#username').val();
        var password = $('#password').val();

        user.login(username, password);
    };

    $('#username').focus();
  });

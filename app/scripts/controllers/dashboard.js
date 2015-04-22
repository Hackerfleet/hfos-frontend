'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:DashboardCtrl
 * @description
 * # HudCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
  .controller('DashboardCtrl', function ($scope, socket) {

    $scope.true_course = 0;
    $scope.spd_over_grnd = 0;

    socket.send({'type': 'info', 'content':'Dashboard activated'});


    socket.onMessage(function(message) {
        // Dashboard handler
        var data = JSON.parse(message.data);
        if(data.type=="navdata") {
            console.log("Updating navigation data.");
            $scope.true_course = data.content.true_course;
            $scope.spd_over_grnd = data.content.spd_over_grnd;
        }
    });


  });
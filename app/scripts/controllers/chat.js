'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('ChatCtrl', function ($scope, Chat) {

        $scope.messages = [];
        $scope.input = '';
        $scope.messages = Chat.messages;

        $scope.$watch('Chat.messages', function (newVal, oldVal) {
            console.log('Chat controller received new message: ', newVal);
            if (newVal) {
                $scope.messages = newVal;
            }
        });

        $scope.chatsend = function () {
            console.log('Transmitting current message.');
            Chat.send($scope.input);
            $scope.input = '';
        };

    });

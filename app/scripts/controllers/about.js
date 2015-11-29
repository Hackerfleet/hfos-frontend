'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('AboutCtrl', function ($scope, socket, Alert) {
        $scope.consoleinput = "";

        $('#path').css({fill: "#afafff"});

        var command = function (cmd) {
            socket.send({
                'component': 'debugger',
                'action': cmd,
                'data': ''
            });
            Alert.add('info', 'Debugger', 'Sent: ' + $scope.consoleinput, 5);
        };

        $scope.enableDebug = function () {
            $('#debug').toggleClass('hidden');
        };

        $scope.sendcommand = function () {
            command($scope.consoleinput);
        };

        $scope.memdebug = function () {
            command('memdebug');
        };

        $scope.graph = function () {
            command('graph');
        };
    });

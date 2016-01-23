'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('AboutCtrl', function ($scope, $interval, socket, Alert) {
        $scope.consoleinput = "";

        var updater = {};

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
            updateStats();
            updater = $interval(updateStats, 1);
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

        var updateStats = function () {
            $scope.stats = {
                rx: socket.stats.rx,
                tx: socket.stats.tx,
                start: socket.stats.start,
                lag: 'N/A'
            };
        };

        // $scope.enableDebug();
    });

'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.Alert
 * @description
 * # Alert
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('Alert', function ($rootScope, $interval, socket, createDialog, $alert) {

        console.log('[ALERT] Service ready.');

        var blinkstate = true;
        var blinker = '';
        var alerting = false;

        var mobBlinker = function () {
            if (blinkstate === false) {
                blinkstate = true;
                $('#mainmenu').css('background', '#FF2222');
            } else {
                blinkstate = false;
                $('#mainmenu').css('background', '#772222');
            }
        };

        var mobAlert = function () {
            if (alerting === false) {
                console.log('[ALERT] ManOverBoard alert triggered!');
                $('#mainmenu').css('background', '#AA2222');
                $('#btnmob').css('color', '#FF0');
                alerting = true;
                blinker = $interval(mobBlinker, 1500);
            }
        };

        var mobDeactivate = function () {
            if (alerting === true) {
                console.log('[ALERT] ManOverBoard alert deactivated.');
                alerting = false;
                $interval.cancel(blinker);
                $('#mainmenu').css('background', '');
                $('#btnmob').css('color', '#F00');
            }
        };

        var mobTrigger = function () {
            if (alerting === true) {
                showDeactivate();
            } else {
                console.log('[ALERT] MOB Alarm triggered. Transmitting to node.');
                socket.send({'component': 'alert', 'action': 'mob', 'data': true});
            }
        };

        var deactivateAlarm = function () {
            console.log('[ALERT] Deactivating client local alert.');
            mobDeactivate();
        };

        var cancelAlarm = function () {
            console.log('[ALERT] Requesting cancellation of alert upon user request.');
            socket.send({'component': 'alert', 'action': 'mob', 'data': false});
        };


        var showDeactivate = function () {
            createDialog('/views/modals/alertdeactivation.tpl.html', {
                    id: 'alertdeactivationDialog',
                    title: 'Deactivate Alert',
                    backdrop: false,
                    footerTemplate: '<span></span>'
                }
            );
        };

        socket.onMessage(function (message) {
            // Alert Handler
            var msg = JSON.parse(message.data);

            if (msg.component === 'alert') {
                console.log('[ALERT] Got an alert packet!');

                if (msg.action === 'mob') {
                    console.log('[ALERT] Activating MOB alert!');
                    if (msg.data === true) {
                        mobAlert();
                        add('danger', 'MOB Alert', 'A man over board alert has been triggered shipwide.', 5);

                    } else if (msg.data === false) {
                        mobDeactivate();
                        add('success', 'MOB Cancelled', 'A triggered man over board alert has been cancelled.', 5);
                    }
                } else if (msg.action === 'error') {
                    add('danger', 'Error!', msg.data, 5);
                }
            }
        });

        $rootScope.$on('User.Login', function () {
            $('#btnmob').removeClass('hidden');
        });

        var add = function (type, title, msg, duration) {
            console.log('[ALERT] Emitting new alert');
            $alert({
                'title': title,
                'content': msg,
                'placement': 'top',
                'type': type,
                'show': true,
                'duration': duration
            });
            //$rootScope.$broadcast("Alert.Add", type, msg);
        };


        return {
            add: add,
            mobTrigger: mobTrigger,
            cancelAlarm: cancelAlarm,
            deactivateAlarm: deactivateAlarm
        };
    }).controller('AlertCtrl', function ($scope, Alert) {
        console.log('[ALERT] AlertCtrl loaded!');

        $scope.cancelAlarm = Alert.cancelAlarm;
        $scope.deactivateAlarm = Alert.deactivateAlarm;

        $('#cancel').focus();
    });

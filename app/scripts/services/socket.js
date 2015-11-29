'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.socket
 * @description
 * # socket
 * Factory in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .factory('socket', function (ngSocket, $timeout, $location, $alert) {

        var host = $location.host();
        var port = 8055;

        var sock = ngSocket('ws://' + host + ':' + port + '/websocket');

        var reconnecttimer = '';
        var reconnecttries = 0;
        var stayonline = true;
        var connected = false;
        var trying = false;

        var disconnectalert = $alert({
            'title': 'Offline',
            'placement': 'top-left',
            'type': 'warning',
            'show': false
        });

        sock.onMessage(function (args) {
            console.log(args);
        });

        var getHost = function () {
            return host;
        };

        var doReconnect = function () {
            console.log('[SOCKET] Trying to reconnect.');
            //sock.reconnect();

            reconnecttries++;
            trying = true;

            var interval = Math.min(30, Math.pow(reconnecttries, 2));

            disconnectalert.hide();

            disconnectalert = $alert({
                'title': 'Offline',
                'content': 'You have been disconnected from the node. Retry interval is at ' + humanizeDuration(interval * 1000),
                'placement': 'top-left',
                'type': 'warning',
                'show': true,
                'duration': interval
            });

            var color = function (value) {
                return '#FF' + parseInt((1 - value) * 255).toString(16) + '00'; // .toString(16);
            };

            $('#btnhome').css('color', color(interval / 30));

            reconnecttimer = $timeout(doReconnect, interval * 1000);
            //reconnecttimer = $interval(doReconnect, interval);
        };

        var finallyClosed = function () {
            console.log('[SOCKET] Something closed the websocket!');
            connected = false;
            $('#btnhome').css('color', 'red');

            hideElements();
        };

        var hideElements = function () {
            $('#btnuser').addClass('hidden');
            // TODO: Mob button should rather be gray and recording the MOB alert for later,
            // if possible with phone-local GPS coords
            $('#btnmob').addClass('hidden');
            $('#btnchat').addClass('hidden');
        };

        var OpenEvent = function () {
            console.log('[SOCKET] Websocket successfully opened!');
            connected = true;
            stayonline = true;
            trying = false;
            reconnecttries = 0;

            disconnectalert.hide();

            var currentdate = new Date();
            document.getElementById('btnhome').title = 'Connected since ' + currentdate;

            $alert({
                'title': 'Online',
                'content': "The connection to the node has been established. You're online!",
                'placement': 'top-left',
                'type': 'info',
                'show': true,
                'duration': 5
            });

            $timeout.cancel(reconnecttimer);
            $('#btnhome').css('color', '#3a75a8');
            $('#btnuser').removeClass('hidden').css('color', '');
        };

        var CloseEvent = function () {
            console.log('[SOCKET] Close event called.');

            connected = false;

            var currentdate = new Date();

            document.getElementById('btnhome').title = 'Disconnected since ' + currentdate;
            //$('#btnhome').prop('title', 'Disconnected since ' + currentdate);

            hideElements();
            if (trying === true) {
                console.log('[SOCKET] Already trying');
                return;
            }
            if (stayonline === true) {
                doReconnect();
            } else {
                finallyClosed();
            }
        };

        sock.onOpen(OpenEvent);
        sock.onClose(CloseEvent);

        var isConnected = function () {
            return connected;
        };

        var doDisconnect = function () {
            stayonline = false;
            sock.close();
            //hideElements();
        };

        var check = function () {
            console.log('[SOCKET] Connection state: ', connected);

            if (connected) {
                console.log('[SOCKET] All nice, we are still connected');
            } else {
                console.log('[SOCKET] Reconnecting...');
                sock.reconnect();
            }
        };

        var send = function (msg) {
            console.log('[SOCKET] Transmitting: ', msg);
            sock.send(msg);
        };

        return {
            connected: isConnected,
            host: getHost,
            disconnect: doDisconnect,
            check: check,
            send: send,

            // TODO: I think, working with signals could be better than this hooky mess:
            onMessage: function (func) {
                console.log('[SOCKET] Reception hook registered: ', String(func).slice(0, 50));
                return sock.onMessage(func);
            },
            onOpen: function (func) {
                console.log('[SOCKET] Reception hook registered: ', String(func).slice(0, 50));
                return sock.onOpen(func);
            },
            onClose: function (func) {
                console.log('[SOCKET] Reception hook registered: ', String(func).slice(0, 50));
                return sock.onClose(func);
            }
        };
    });

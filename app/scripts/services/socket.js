'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.socket
 * @description
 * # socket
 * Factory in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .factory('socket', function (ngSocket, $timeout, $location) {

        var host = $location.host();
        var port = 8055;

        var sock = ngSocket('ws://' + host + ':' + port + '/websocket');
        var reconnecttimer = '';
        var reconnecttries = 0;

        var stayonline = true;
        var connected = false;
        var trying = false;

        sock.onMessage(function (args) {
            console.log(args);
        });

        var getHost = function () {
            return host;
        };

        var doReconnect = function () {
            console.log('[SOCKET] Trying to reconnect.');
            sock.reconnect();

            reconnecttries++;
            trying = true;

            var interval = Math.min(30, Math.pow(reconnecttries, 2)) * 1000;
            reconnecttimer = $timeout(doReconnect, interval);
            console.log('[SOCKET] Resetting interval to ', interval);
            //reconnecttimer = $interval(doReconnect, interval);
        };

        var finallyClosed = function () {
            console.log('[SOCKET] Something closed the websocket!');
            connected = false;
            $('#btnhome').css('color', '#f00');
            $('#btnmob').addClass('hidden');
            // TODO: Mob button should rather be gray and recording the MOB alert for later,
            // if possible with local GPS coords
            $('#btnuser').css('color', '#fa0').addClass('hidden');
        };

        var OpenEvent = function () {
            console.log('[SOCKET] Websocket successfully opened!');
            connected = true;
            stayonline = true;
            trying = false;
            reconnecttries = 0;

            $timeout.cancel(reconnecttimer);
            $('#btnhome').css('color', '#3a75a8');
            $('#btnuser').removeClass('hidden').css('color', '');
        };

        var CloseEvent = function () {
            console.log('[SOCKET] Close event called.');

            connected = false;
            $('#btnhome').css('color', '#FF0');

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

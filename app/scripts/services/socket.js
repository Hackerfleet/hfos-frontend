'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.socket
 * @description
 * # socket
 * Factory in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .factory('socket', ['ngSocket', '$location', function (ngSocket, $location) {

        var host = $location.host();
        var port = 8055;
        var sock = ngSocket('ws://' + host + ':' + port + '/websocket');
        sock.onMessage(function (args) {
            console.log(args);
        });

        var getHost = function () {
            return host;
        };

        var connected = false;

        var OpenEvent = function (args) {
            console.log('[SOCKET] Websocket successfully opened!', args);
            connected = true;
            $('#btnhome').css('color', '#3a75a8');
            $('#btnuser').removeClass('hidden').css('color', '');
        };

        var CloseEvent = function (args) {
            console.log('[SOCKET] Something closed the websocket!', args);
            connected = false;
            $('#btnhome').css('color', '#f00');
            $('#btnuser').css('color', '#fa0').addClass('hidden');
        };

        sock.onOpen(OpenEvent);
        sock.onClose(CloseEvent);

        var isConnected = function () {
            return connected;
        };

        var doDisconnect = function () {
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
    }]);

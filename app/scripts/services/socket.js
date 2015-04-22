'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.socket
 * @description
 * # socket
 * Factory in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
  .factory('socket', function (ngSocket, $location) {

    var host = $location.host();
    var port = 8055;
    var sock = ngSocket('ws://' + host + ':' + port +  '/websocket');
    //sock.onMessage(function(args) {
    //    console.log(args);
    //});

    var getHost = function() {
        return host;
    }

    var connected = false;

    var OpenEvent = function(args) {
        console.log('Websocket successfully opened!', args);
        connected = true;
        $('#btnhome').css('color', '#3a75a8')
        $('#btnuser').removeClass('hidden');
        $('#btnuser').css('color', '');
    };

    var CloseEvent = function(args) {
        console.log('Something closed the websocket!', args);
        connected = false;
        $('#btnhome').css('color', '#f00')
        $('#btnuser').css('color', '#fa0')
        $('#btnuser').addClass('hidden');
    };

    sock.onOpen(OpenEvent);
    sock.onClose(CloseEvent);

    var isConnected = function() {
        return connected;
    }

    var doDisconnect = function() {
        sock.close();
    }

    return {
      connected: isConnected,
      host: getHost,
      disconnect: doDisconnect,
      check: function () {
        console.log('Connection state: ', connected);
        console.log(sock);
        if (connected) {
            console.log('All nice, we are still connected');
        } else {
            console.log('Reconnecting...');
            sock.reconnect();
        }
      },
      onMessage: function (func) {
        console.log('Reception hook registered: ', String(func).slice(0, 50));
        return sock.onMessage(func);
      },
      onOpen: function (func) {
        console.log('Reception hook registered: ', String(func).slice(0, 50));
        return sock.onOpen(func);
      },
      onClose: function (func) {
        console.log('Reception hook registered: ', String(func).slice(0, 50));
        return sock.onClose(func);
      },
      send: function(args) {
        console.log('Transmitting: ', args);
        sock.send(args);
      }
    };
  });

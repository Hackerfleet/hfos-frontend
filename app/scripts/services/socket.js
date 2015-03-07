'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.socket
 * @description
 * # socket
 * Factory in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
  .factory('socket', function (ngSocket) {
      var sock = ngSocket('ws://localhost:8055/websocket');
    //sock.onMessage(function(args) {
    //    console.log(args);
    //});

    var connected = false;

    var OpenEvent = function(args) {
        console.log('Websocket successfully opened!', args);
        connected = true;
        $("#btnhome").css("color", "#3a75a8")
        $("#btnuser").removeClass("hidden");
    };

    var CloseEvent = function(args) {
        console.log('Something closed the websocket!', args);
        connected = false;
        $("#btnhome").css("color", "#f00")
        $("#btnuser").addClass("hidden");
    };

    sock.onOpen(OpenEvent);
    sock.onClose(CloseEvent);

    var isConnected = function() {
        return connected;
    }

    return {
      connected: isConnected,
      check: function () {
        console.log("Connection state: ", connected);
        console.log(sock);
        if (connected) {
            console.log('All nice, we are still connected');
        } else {
            console.log('Reconnecting...');
            sock.reconnect();
        }
      },
      onMessage: function (func) {
        console.log('Reception hook registered: ', func);
        return sock.onMessage(func);
      },
      send: function(args) {
        console.log('Transmitting: ', args);
        sock.send(args);
      }
    };
  });

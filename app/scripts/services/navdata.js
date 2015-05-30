'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.Navdata
 * @description
 * # Navdata
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
  .service('Navdata', function ($rootscope, socket) {

    socket.onMessage(function(message) {
        // Dashboard handler
        var msg = JSON.parse(message.data);
        if(msg.component == "navdata" && msg.action == "update") {
            console.log("Updating navigation data.");
            console.log(msg.action, msg.data);
            $rootscope.$broadcast("hfos.NavdataUpdate");
        }
    });

  });

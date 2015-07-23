'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.navdata
 * @description
 * # navdata
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('navdata', function ($rootScope, socket) {
        console.log('Hello world, im the navdata thing.');
        socket.onMessage(function (message) {
            // Dashboard handler
            var msg = JSON.parse(message.data);
            if (msg.component === 'navdata' && msg.action === 'update') {
                console.log('Updating navigation data.');
                console.log(msg.action, msg.data);
                $rootScope.$broadcast('hfos.NavdataUpdate');
            }
        });

    });

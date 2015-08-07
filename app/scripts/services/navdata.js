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
        console.log('[NAVDATA] Service starting.');

        var referenceframe = {};
        var referenceages = {};


        socket.onMessage(function (message) {
            // Dashboard handler
            var msg = JSON.parse(message.data);
            if (msg.component === 'navdata' && msg.action === 'update') {
                console.log('Updating navigation data.');

                var refdata = msg.data;
                referenceframe = refdata['data'];
                referenceages = refdata['ages'];

                $rootScope.$broadcast('hfos.NavdataUpdate', referenceframe);
            }
        });

    });

'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.MapViewService
 * @description
 * # MapViewService
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('MapViewService', function ($rootScope, socket, user, schemata, createDialog) {
        /*
        var mapviews = {};

        var onChangeCallbacks = {};

        var requestMapData = function () {
            console.log('Requesting map view data from server.');
            socket.send({'component': 'mapview', 'action': 'list'});
            //socket.send({'component': 'mapview', 'action': 'get'});
        };


        var subscribe = function (args) {
            console.log('Subscribing to mapview ', args);
            socket.send({'component': 'mapview', 'action': 'subscribe', 'data': args});
        };

        var selectview = function () {
            createDialog('views/modals/mapviewselect.tpl.html', {
                    id: 'mapviewselectDialog',
                    title: 'Select a mapview to follow',
//              success: {label: 'Select', fn: subscribe},
                    controller: 'MapViewSelectCtrl'
                },
                {
                    mapview: mapview,
                    mapviews: mapviews
                }
            );
        };

        var getdata = function (uuid) {
            console.log('Mapview data requested for ', uuid);
            return mapviews[uuid];
        };

        var updateview = function (mapview) {
            console.log('Sending mapview update: ', mapview);
            if (mapview.uuid !== '') {
                socket.send({'component': 'mapview', 'action': 'update', 'data': mapview});
            }
        };

        user.onAuth(function () {
            // Initial MapView getter
            requestMapData();
        });


        var notifyListeners = function (mapview) {
            $rootScope.$broadcast('mapviewupdate', mapview);
        };

        socket.onMessage(function (message) {
            // Mapview Handler
            var msg = JSON.parse(message.data);

            if (msg.component === 'mapview') {
                if (msg.action === 'update') {
                    var mapview = msg.data;
                    console.log('MapView update received: ', mapview);
                    mapviews[mapview.uuid] = msg.data;
                    notifyListeners(mapview);
                } else if (msg.action === 'list') {
                    console.log('MapView list received: ', msg.data);
                    mapviews = msg.data;
                }
            }
        });


        return {
            update: updateview,
            selectview: selectview,
         subscribe: subscribe
        };
         */

    });

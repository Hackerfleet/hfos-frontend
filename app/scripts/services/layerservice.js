'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.LayerService
 * @description
 * # LayerService
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('LayerService', function ($rootScope, schemata, user, socket) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        console.log('[LS] Layerservice starting');

        var onLayerChangeCallbacks = {};
        var layers = {};
        var groups = {};

        socket.onMessage(function (message) {
            // Layer Handler
            var msg = JSON.parse(message.data);

            if (msg.component === 'layers') {
                console.log('Got a layer packet!');

                if (msg.action === 'list') {
                    console.log('Got a list of layers.');
                    layers = msg.data;
                } else if (msg.action === 'update') {
                    // TODO: Actually update the layer here
                    notifyLayerChange(msg.data);
                }
            }
        });

        var updateLayers = function () {
            console.log('[LS] Requesting current data');
            socket.send({'component': 'layer', 'action': 'list', 'data': 'layers'});
            // socket.send({'component': 'layer', 'action': 'list', 'data': 'groups'});
        };

        $rootScope.$on("User.Login", updateLayers);

        if (user.signedin()) {
            updateLayers();
        }

        var notifyLayerChange = function (change) {
            console.log('[LS] Notifying change callbacks');
            for (var i = 0; i < onLayerChangeCallbacks.length; i++) {
                onLayerChangeCallbacks[i].call(change);
            }
        };

        var getLayers = function () {
            return layers;
        };

        var getGroups = function () {
            return groups;
        };

        return {
            requestData: updateLayers,
            layers: getLayers,

            onLayerChange: function (callback) {
                if (typeof callback !== 'function') {
                    throw new Error('Callback must be a function');
                }

                onLayerChangeCallbacks.push(callback);
            }
        };
    });

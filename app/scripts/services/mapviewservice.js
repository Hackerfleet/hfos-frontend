'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.MapViewService
 * @description
 * # MapViewService
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
  .service('MapViewService', function (socket, user, schemata, createDialog) {
    var mapviews = {};
    var mapview = {
        uuid: '',
        name: 'Unnamed MapView',
        color: '',
        shared: false,
        notes: '',
        coords: {
            lat: 0,
            lon: 0,
            zoom: 5,
            autoDiscover: false
        }
    }

    var onChangeCallbacks = {};

    var requestMapData = function() {
        console.log('Requesting map view data from server.');
        socket.send({'component': 'mapview', 'action': 'list'});
        socket.send({'component': 'mapview', 'action': 'get'});
    }


    var subscribe = function(args) {
        console.log('Subscribing to mapview ', args);
        socket.send({'component': 'mapview', 'action': 'subscribe', 'data': args})
    }

    var selectview = function() {
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

    var getdata = function() {
        console.log('Current mapview requested');
        return mapview;
    }

    var updateview = function(newmapview) {
        console.log(newmapview);
        var mv = this.mapview();
        console.log(mv);
        if (mv.uuid != '') {
            socket.send({'component': 'mapview', 'action': 'update', 'data': mv});
        }
    }

    user.onAuth(function() {
        requestMapData();
    });


    var notifyListeners = function(mapview) {
        if (onChangeCallbacks[mapview.uuid] != '') {
            console.log('Executing onChange callback with ', mapview);
            for (var i = 0; i < onChangeCallbacks[mapview.uuid].length; i++) {
              onChangeCallbacks[mapview.uuid][i].call(this, mapview);
            }
        }
    }

    socket.onMessage(function(message) {
        var msg = JSON.parse(message.data);

        if(msg.component === 'mapview') {
            if(msg.action === 'update'){
                mapview = msg.data
                console.log('MapView update received: ', mapview);
                mapviews[mapview.uuid] = msg.data;
                notifyListeners(mapview);
            } else if(msg.action === 'get') {
                console.log('MapView received: ', msg.data);
                mapview = msg.data;
                notifyListeners(mapview);
            } else if(msg.action === 'list') {
                console.log("MapView list received: ", msg.data);
                mapviews = msg.data;
            }
        }
    });


    return {
        mapview: getdata,
        update: updateview,
        selectview: selectview,
        subscribe: subscribe,
        onChange: function (callback, uuid) {
            if (typeof callback !== 'function') {
              throw new Error('Callback must be a function');
            }
            if (!(uuid in onChangeCallbacks)) {
                onChangeCallbacks[uuid] = [];
            }
            onChangeCallbacks[uuid].push(callback);
        }
    };


  }).controller('MapViewSelectCtrl', ['$scope', 'mapview', 'mapviews', 'MapViewService',
    function($scope, mapview, mapviews, MapViewService) {
        $scope.mapview = mapview;
        $scope.mapviews = mapviews;
        console.log("MVS Ctrl: ", mapview, mapviews);
        $scope.selectMV = function(uuid) {
            console.log('MVS Ctrl: Selected:', uuid);
            MapViewService.subscribe(uuid);
        }
  }]);;

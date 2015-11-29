'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.Objectproxy
 * @description
 * # ObjectProxy
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('ObjectProxy', function ($q, socket, user, schemata, $rootScope) {

        var objects = {};
        var lists = {};
        var searchcallbacks = {};

        var requestId = 0;

        var getRequestId = function () {
            return requestId++;
        };

        console.log('[OP] Object proxy service started');

        socket.onMessage(function (message) {
            // ObjectProxy handler
            var msg = JSON.parse(message.data);
            if (msg.component === 'objectmanager') {
                if (msg.action === 'get') {
                    var obj = msg.data;
                    console.log('[OP] Received object from OM: ', obj);

                    objects[obj.uuid] = obj;
                    $rootScope.$broadcast('OP.Get', obj.uuid);
                } else if (msg.action === 'update') {
                    var obj = msg.data;
                    console.log('[OP] Subscription update from OM: ', obj);

                    objects[obj.uuid] = obj;
                    $rootScope.$broadcast('OP.Update', obj.uuid);
                } else if (msg.action === 'put') {
                    var result = msg.data[0];
                    var putuuid = msg.data[1];

                    if (result === true) {
                        console.log('[OP] Object successfully stored.');
                        $rootScope.$broadcast('OP.Put', putuuid);
                    } else {
                        console.log('[OP] Page was not stored correctly: ', putuuid);
                    }
                } else if (msg.action === 'delete' || msg.action === 'deletion') {
                    var result = msg.data[0];
                    var deluuid = msg.data[1];

                    if (result === true) {
                        console.log('[OP] Object was deleted.');
                        $rootScope.$broadcast('OP.Deleted', deluuid);
                    } else {
                        console.log('[OP] Page was not stored correctly: ', deluuid);
                    }
                } else if (msg.action === 'list') {
                    var list = msg.data['list'];
                    var schema = msg.data['schema'];

                    lists[schema] = list;

                    console.log('[OP] Received object list from OM: ', schema, list);

                    $rootScope.$broadcast('OP.ListUpdate', schema);
                } else if (msg.action === 'search') {
                    var requestId = msg.data['req'];
                    var searchdata = msg.data['list'];
                    console.log("[OP] Search result came back: ", searchdata);

                    if (angular.isDefined(searchcallbacks[requestId])) {
                        var searchcallback = searchcallbacks[requestId];
                        delete searchcallbacks[requestId];
                        searchcallback.resolve(searchdata);
                    } else {
                        console.log("Unhandled message: %o", msg);
                    }

                }
                console.log('Proxied objects: ', objects);
                console.log('Proxied lists: ', lists);
            }

        });

        var getObject = function (schema, uuid) {
            console.log('[OP] Fetching object ', schema, uuid);
            socket.send({'component': 'objectmanager', 'action': 'get', 'data': {'schema': schema, 'uuid': uuid}});
        };

        var subscribeObject = function (uuid) {
            console.log('[OP] Subscribing to object ', uuid);
            socket.send({'component': 'objectmanager', 'action': 'subscribe', 'data': uuid});
        };

        var unsubscribeObject = function (uuid) {
            console.log('[OP] Unsubscribing to object ', uuid);
            socket.send({'component': 'objectmanager', 'action': 'unsubscribe', 'data': uuid});
        };

        var putObject = function (schema, obj) {
            console.log('[OP] Putting object ', schema, obj);
            // TODO: Validate it first and bail out. Form might already do this, but we should just make sure.
            socket.send({'component': 'objectmanager', 'action': 'put', 'data': {'schema': schema, 'obj': obj}});
        };

        var delObject = function (schema, uuid) {
            console.log('[OP] Putting object ', schema, uuid);
            socket.send({'component': 'objectmanager', 'action': 'delete', 'data': {'schema': schema, 'uuid': uuid}});
        };

        var searchItems = function (schema, search) {
            console.log('[OP] Async-getting list for schema ', schema, search);

            var reqid = getRequestId();

            socket.send({
                'component': 'objectmanager',
                'action': 'search',
                'data': {
                    'req': reqid,
                    'schema': schema,
                    'search': search
                }
            });

            var deferred = $q.defer();
            searchcallbacks[reqid] = deferred;

            return deferred.promise.then(function (response) {
                console.log('OP ASYNC Delivering:', response);
                return {'data': response};
            });
        };


        var getList = function (schema, filter, fields) {
            console.log('[OP] Getting object list ', schema, filter, fields);
            socket.send({
                'component': 'objectmanager',
                'action': 'list',
                'data': {
                    'schema': schema,
                    'filter': filter,
                    'fields': fields
                }
            });
        };


        return {
            obj: objects,
            lists: lists,
            newgetlist: searchItems,
            getlist: getList,
            get: getObject,
            subscribe: subscribeObject,
            unsubscribe: unsubscribeObject,
            put: putObject,
            del: delObject
        };
    })
;

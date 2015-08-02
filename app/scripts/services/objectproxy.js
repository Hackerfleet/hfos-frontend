'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.Objectproxy
 * @description
 * # ObjectProxy
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('ObjectProxy', function (socket, user, $rootScope) {

        var objects = {};
        var lists = {};

        console.log('[OP] Object proxy service started');

        socket.onMessage(function (message) {
            // ObjectProxy handler
            var msg = JSON.parse(message.data);
            if (msg.component === 'objectmanager') {
                if (msg.action === 'get') {
                    var obj = msg.data;
                    console.log('[OP] Received object from OM: ', obj);

                    objects[obj.uuid] = obj;
                    $rootScope.$broadcast('OP.Change', obj.uuid);
                } else if (msg.action === 'put') {
                    var result = msg.data[0];
                    var putuuid = msg.data[1];

                    if (result === true) {
                        console.log('[OP] Object successfully stored.');
                        $rootScope.$broadcast('OP.Stored', putuuid);
                    } else {
                        console.log('[OP] Page was not stored correctly: ', putuuid);
                    }
                } else if (msg.action === 'list') {
                    var list = msg.data['list'];
                    var schema = msg.data['schema']

                    lists[schema] = list;

                    console.log('[OP] Received object list from OM: ', schema, list);

                    $rootScope.$broadcast('OP.ListUpdate', schema);
                }
                console.log('Proxied objects: ', objects);
                console.log('Proxied lists: ', lists);
            }

        });

        var getObject = function (schema, uuid) {
            console.log('[OP] Fetching object ', schema, uuid);
            socket.send({'component': 'objectmanager', 'action': 'get', 'data': {'schema': schema, 'uuid': uuid}});
        };

        var putObject = function (schema, obj) {
            console.log('[OP] Putting object ', schema, obj);
            socket.send({'component': 'objectmanager', 'action': 'put', 'data': {'schema': schema, 'obj': obj}});
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
            getlist: getList,
            get: getObject,
            put: putObject
        };
    });

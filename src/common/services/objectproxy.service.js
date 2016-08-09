/*
 * Hackerfleet Operating System
 * =====================================================================
 * Copyright (C) 2011-2016 riot <riot@hackerfleet.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Created by riot on 10.03.16.
 */

'use strict';

/* TODO:
 * Handle renamed objects
 * Delete objects locally, too
 * Check out search, there's some problems
 * On put, update: Validate first and bail out. Form might already do this, but we should just make sure.
 */

/* old reverse mapping of service:
 obj: objects,
 lists: lists,
 newgetlist: searchItems,
 getlist: getList,
 get: getObject,
 subscribe: subscribeObject,
 unsubscribe: unsubscribeObject,
 put: putObject,
 del: delObject
 */

class ObjectProxy {
    constructor($q, $socket, $user, $schemata, $rootScope) {
        console.log('[OP] Object proxy service started');
        this.q = $q;
        this.socket = $socket;
        this.user = $user;
        this.schemata = $schemata;
        this.rootscope = $rootScope;

        this.requestId = 0;

        this.objects = [];

        this.namelookup = {};
        this.lists = {};
        this.searchcallbacks = {};

        var self = this;

        function handleResponse(msg) {
            var result;
            var newobj;
            var schema = null;

            if (msg.action === 'get' || msg.action === 'update') {
                newobj = msg.data;
                schema = newobj.id.slice(1);

                if (schema === null) {
                    console.log('[OP] Strange object without ID received.');
                    return;
                }
            }

            if (msg.action === 'get') {
                console.log('[OP] Received object from OM: ', newobj);

                self.objects[newobj.uuid] = newobj;
                if ('name' in newobj) {
                    self.namelookup[name] = newobj.uuid;
                }

                self.rootscope.$broadcast('OP.Get', newobj.uuid, newobj, schema);

            } else if (msg.action === 'update') {
                console.log('[OP] Subscription update from OM: ', newobj);

                self.objects[newobj.uuid] = newobj;

                self.rootscope.$broadcast('OP.Update', newobj.uuid, newobj, schema);

            } else if (msg.action === 'put') {
                result = msg.data[0];
                var putuuid = msg.data[1];

                if (result === true) {
                    console.log('[OP] Object successfully stored.');
                    self.rootscope.$broadcast('OP.Put', putuuid);
                } else {
                    console.log('[OP] Page was not stored correctly: ', putuuid);
                }

            } else if (msg.action === 'delete' || msg.action === 'deletion') {
                result = msg.data[0];
                var deluuid = msg.data[1];

                if (result === true) {
                    console.log('[OP] Object was deleted.');
                    self.rootscope.$broadcast('OP.Deleted', deluuid);

                } else {
                    console.log('[OP] Page was not deleted correctly: ', deluuid);
                }

            } else if (msg.action === 'list') {
                var list = msg.data.list;
                schema = msg.data.schema;

                self.lists[schema] = list;

                console.log('[OP] Received object list from OM: ', schema, list);

                self.rootscope.$broadcast('OP.ListUpdate', schema);

            } else if (msg.action === 'search') {
                var requestId = msg.data.req;
                var searchdata = msg.data.list;
                console.log('[OP] Search result came back: ', searchdata);

                // This cannot work, but did so in the previous revision:
                if (angular.isDefined(self.searchcallbacks[requestId])) {
                    var searchcallback = self.searchcallbacks[requestId];
                    delete self.searchcallbacks[requestId];
                    searchcallback.resolve(searchdata);
                } else {
                    console.log('Unhandled search: ', msg);
                }

            }
            console.log('Proxied objects: ', self.objects);
            console.log('Proxied lists: ', self.lists);
        }


        self.socket.listen('objectmanager', handleResponse);
    }

    getRequestId() {
        return this.requestId++;
    }

    getObject(schema, uuid, subscribe) {
        console.log('[OP] Fetching object ', schema, uuid);
        this.socket.send({
            'component': 'objectmanager',
            'action': 'get',
            'data': {'schema': schema, 'uuid': uuid, 'subscribe': subscribe}
        });
    }

    getObjectUuid(schema, name) {
        console.log('[OP] Getting object uuid', schema, name);
        if (name in this.namelookup) {
            if (schema) {
                return this.namelookup[name][schema];
            }
        }
    }

    getObjectName(uuid) {
        console.log('[OP] Getting object name', uuid);
        if (uuid in this.objects) {
            return this.objects[uuid].name;
        } else {
            return 'Unknown object';
        }
    }

    subscribeObject(uuid) {
        console.log('[OP] Subscribing to object ', uuid);
        this.socket.send({'component': 'objectmanager', 'action': 'subscribe', 'data': uuid});
    }

    unsubscribeObject(uuid) {
        console.log('[OP] Unsubscribing to object ', uuid);
        this.socket.send({'component': 'objectmanager', 'action': 'unsubscribe', 'data': uuid});
    }

    changeObject(schema, obj, change) {
        console.log('[OP] Changing object ', schema, obj, change);
        this.socket.send({
            'component': 'objectmanager',
            'action': 'change',
            'data': {'uuid': obj, 'schema': schema, 'change': change}
        });
    }

    putObject(schema, obj) {
        console.log('[OP] Putting object ', schema, obj);
        this.socket.send({'component': 'objectmanager', 'action': 'put', 'data': {'schema': schema, 'obj': obj}});
    }

    delObject(schema, uuid) {
        console.log('[OP] Deleting object ', schema, uuid);
        this.socket.send({'component': 'objectmanager', 'action': 'delete', 'data': {'schema': schema, 'uuid': uuid}});
    }

    searchItems(schema, search) {
        console.log('[OP] Async-getting list for schema ', schema, search);

        var reqid = this.getRequestId();

        this.socket.send({
            'component': 'objectmanager',
            'action': 'search',
            'data': {
                'req': reqid,
                'schema': schema,
                'search': search
            }
        });

        var deferred = this.q.defer();
        this.searchcallbacks[reqid] = deferred;

        return deferred.promise.then(function (response) {
            console.log('OP ASYNC Delivering:', response);
            return {'data': response};
        });
    }

    getList(schema, filter, fields) {
        console.log('[OP] Getting object list ', schema, filter, fields);
        this.socket.send({
            'component': 'objectmanager',
            'action': 'list',
            'data': {
                'schema': schema,
                'filter': filter,
                'fields': fields
            }
        });
    }

    list(name) {
        return this.lists[name];
    }

    lists() {
        return this.lists;
    }
}

ObjectProxy.$inject = ['$q', 'socket', 'user', 'schemata', '$rootScope'];

export default ObjectProxy;

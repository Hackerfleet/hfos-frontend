/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2018 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Created by riot on 10.03.16.
 */

'use strict';

let jsondiffpatch = require('jsondiffpatch').create();

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
 del: deleteObject
 */

class ObjectProxy {
    constructor($q, $socket, $schemata, $rootScope, statusbar) {
        console.log('[OP] Object proxy service started');
        this.q = $q;
        this.socket = $socket;
        this.schemata = $schemata;
        this.rootscope = $rootScope;
        this.statusbar = statusbar;

        this.requestId = 0;
        this.requests = 0;

        this.objects = {};

        this.namelookup = {};
        this.lists = {};
        this.callbacks = {};

        let self = this;

        this.update_status = function () {
            if (self.requests === 0) {
                self.statusbar.set_status('Ready.')
            } else {
                self.statusbar.set_status(self.requests + ' requests');
            }
        };

        function handleResponse(msg) {
            let result;
            let data;
            let uuid;
            let schema = null;

            let requestId = msg.data.req;

            if (['get', 'update', 'change'].indexOf(msg.action) !== -1) {
                schema = msg.data.schema;
                uuid = msg.data.uuid;
                data = msg.data.object;

                self.objects[uuid] = data;
                if (schema === null) {
                    console.log('[OP] Strange object without ID received.');
                    return;
                }
                let signal = '';
                if (msg.action === 'get') {
                    signal = 'OP.Get'
                } else if (msg.action === 'update') {
                    signal = 'OP.Update'
                } else if (msg.action === 'change') {
                    signal = 'OP.Change'
                }
                self.rootscope.$broadcast(signal, uuid, data, schema);
            } else if (msg.action === 'fail') {
                console.log('[OP] Object manager reported failure:', msg.data);

            } else if (msg.action === 'put') {
                data = msg.data;
                self.objects[data.uuid] = data.object;
                self.rootscope.$broadcast('OP.Put', data.schema, data.uuid, data.object)
            } else if (msg.action === 'delete' || msg.action === 'deletion') {
                data = msg.data;
                delete self.objects[data.uuid];
                self.rootscope.$broadcast('OP.Deleted', data.schema, data.uuid);
            } else if (msg.action === 'getlist') {
                let list = msg.data.list;
                schema = msg.data.schema;

                self.lists[schema] = list;

                console.log('[OP] Received object list from OM: ', schema, list);

                self.rootscope.$broadcast('OP.ListUpdate', schema);
            } else if (msg.action === 'search') {
                console.debug('[OP] Search result came back: ', msg.data.list);
            }

            if (typeof requestId !== 'undefined' && self.requests > 0) {
                self.requests -= 1;
                self.update_status();
            }

            if (angular.isDefined(self.callbacks[requestId])) {
                let callback = self.callbacks[requestId];
                delete self.callbacks[requestId];
                callback.resolve(msg);
            } else {
                console.debug('[OP] Request without callback: ', msg.action, msg.data);
            }
            // console.log('[OP] Proxied objects: ', self.objects);
            // console.log('[OP] Proxied lists: ', self.lists);
        }

        self.socket.listen('hfos.events.objectmanager', handleResponse);

        this.search = function (schema, search, fields, fulltext, subscribe, limit, skip, sort) {
            console.debug('[OP] Async-getting list for schema ', schema, search);

            if (typeof search === 'undefined') {
                search = '';
            }

            let reqid = self.getRequestId();

            if (typeof search === 'undefined') {
                search = '';
            }

            let message = {
                component: 'hfos.events.objectmanager',
                action: 'search',
                data: {
                    req: reqid,
                    schema: schema,
                    search: search,
                    fields: fields,
                    fulltext: fulltext,
                    subscribe: subscribe,
                    limit: limit,
                    skip: skip,
                    sort: sort
                }
            };

            self.socket.send(message);

            let deferred = self.q.defer();
            self.callbacks[reqid] = deferred;

            let query = deferred.promise.then(function (msg) {
                console.debug('[OP] OP ASYNC Delivering:', msg);

                function compare(a, b) {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                }

                if (msg.data.list.length > 0 && typeof msg.data.list[0].name !== 'undefined') {
                    msg.data.list.sort(compare);
                }

                return msg;
            });

            return query;
        };

        this.get = function (schema, uuid, subscribe, filter) {
            console.debug('[OP] Async-getting object ', schema, uuid);

            let reqid = self.getRequestId();

            let message = {
                component: 'hfos.events.objectmanager',
                action: 'get',
                data: {
                    req: reqid,
                    schema: schema,
                    uuid: uuid,
                    subscribe: subscribe,
                    filter: filter
                }
            };

            self.socket.send(message);

            let deferred = self.q.defer();
            self.callbacks[reqid] = deferred;

            let query = deferred.promise.then(function (response) {
                console.log('[OP] Get response:', response);
                return response;
            });

            return query;
        };

        this.put = function (schema, obj) {
            console.debug('[OP] Async-putting object ', schema, obj);

            let reqid = self.getRequestId();

            let message = {
                component: 'hfos.events.objectmanager',
                action: 'put',
                data: {
                    req: reqid,
                    schema: schema,
                    obj: obj
                }
            };

            self.socket.send(message);

            let deferred = self.q.defer();
            self.callbacks[reqid] = deferred;

            let query = deferred.promise.then(function (response) {
                console.debug('[OP] Put response:', response);
                return response;
            });

            return query;
        };
    }

    getRequestId() {
        this.requests += 1;
        this.update_status();

        return this.requestId++;
    }

    getObject(schema, uuid, subscribe, filter) {
        console.warn('[OP] Fetching object synchronously:', schema, uuid);

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'get',
            data: {
                schema: schema,
                uuid: uuid,
                subscribe: subscribe,
                filter: filter
            }
        };

        this.socket.send(message);
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

    subscribe(things) {
        console.log('[OP] Subscribing to object ', things);
        let data;
        if (typeof things === 'string') {
            data = [things];
        } else {
            data = things;
        }

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'subscribe',
            data: data
        };

        this.socket.send(message);
    }

    unsubscribe(things) {
        console.log('[OP] Unsubscribing to object ', things);
        let data;
        if (typeof things === 'string') {
            data = [things];
        } else {
            data = things;
        }

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'unsubscribe',
            data: data
        };

        this.socket.send(message);
    }

    putObject(schema, obj) {
        console.debug('[OP] Putting object ', schema, obj);

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'put',
            data: {
                schema: schema,
                obj: obj
            }
        };

        this.socket.send(message);
    }

    putObjectChange(schema, obj) {
        console.log('[OP] Putting object change', schema, obj);

        console.debug('[OP] OLD:', obj, 'NEW:', this.objects[obj.uuid]);

        let uuid = obj.uuid;

        let change = {
            time: new Date().toISOString(),
            diff: jsondiffpatch.diff(obj, this.objects[uuid])
        };

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'putchangeset',
            data: {
                schema: schema,
                uuid: uuid,
                change: change
            }
        };

        this.socket.send(message);
    }

    changeObject(schema, obj, change) {
        console.log('[OP] Changing object ', schema, obj, change);

        let reqid = this.getRequestId();

        this.socket.send({
            component: 'hfos.events.objectmanager',
            action: 'change',
            data: {
                req: reqid,
                uuid: obj,
                schema: schema,
                change: change
            }
        });

        let deferred = this.q.defer();
        this.callbacks[reqid] = deferred;

        let query = deferred.promise.then(function (response) {
            console.log('[OP] Change response:', response);
            return response;
        });

        return query;
    }

    deleteObject(schema, uuid) {
        console.log('[OP] Deleting object ', schema, uuid);

        let reqid = this.getRequestId();

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'delete',
            data: {
                req: reqid,
                schema: schema,
                uuid: uuid
            }
        };

        this.socket.send(message);

        let deferred = this.q.defer();
        this.callbacks[reqid] = deferred;

        let query = deferred.promise.then(function (response) {
            console.log('[OP] Delete response:', response);
            return response;
        });

        return query;
    }


    getList(schema, filter, fields) {
        console.log('[OP] Getting object list ', schema, filter, fields);

        let message = {
            component: 'hfos.events.objectmanager',
            action: 'getlist',
            data: {
                schema: schema,
                filter: filter,
                fields: fields
            }
        };

        this.socket.send(message);
    }

    list(name) {
        console.log('[OP] LIST ACCESS');
        return this.lists[name];
    }

    lists() {
        console.log('[OP] GLOBAL LIST ACCESS');
        return this.lists;
    }
}

ObjectProxy.$inject = ['$q', 'socket', 'schemata', '$rootScope', 'statusbar'];

export default ObjectProxy;

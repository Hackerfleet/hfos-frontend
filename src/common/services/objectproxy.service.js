/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2017 riot <riot@c-base.org> and others.
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
    constructor($q, $socket, $schemata, $rootScope) {
        console.log('[OP] Object proxy service started');
        this.q = $q;
        this.socket = $socket;
        this.schemata = $schemata;
        this.rootscope = $rootScope;
        
        this.requestId = 0;
        
        this.objects = {};
        
        this.namelookup = {};
        this.lists = {};
        this.callbacks = {};
        
        let self = this;
        
        function handleResponse(msg) {
            let result;
            let data;
            let uuid;
            let schema = null;
    
            let requestId = msg.data.req;
            
            if (msg.action === 'get' || msg.action === 'update') {
                schema = msg.data.schema;
                uuid = msg.data.uuid;
                data = msg.data.object;
                
                self.objects[uuid] = data;
                if (schema === null) {
                    console.log('[OP] Strange object without ID received.');
                    return;
                }
                self.rootscope.$broadcast('OP.Get', uuid, data, schema)
            } else if (msg.action === 'fail') {
                console.log('Object manager reported failure:', msg.data);
                delete self.callbacks[msg.data.req];
            } else if (msg.action === 'put') {
                data = msg.data;
                self.objects[data.uuid] = data.obj;
                self.rootscope.$broadcast('OP.Put', data.schema, data.uuid, data.obj)
            } else if (msg.action === 'delete' || msg.action === 'deletion') {
                data = msg.data;
                delete self.objects[data.uuid];
                self.rootscope.$broadcast('OP.Deleted', data.schema, data.uuid);
            } else if (msg.action === 'list') {
                let list = msg.data.list;
                schema = msg.data.schema;
                
                self.lists[schema] = list;
                
                console.log('[OP] Received object list from OM: ', schema, list);
                
                self.rootscope.$broadcast('OP.ListUpdate', schema);
            } else if (msg.action === 'search') {
                data = msg.data.list;
                console.log('[OP] Search result came back: ', data);
            }
    
            if (angular.isDefined(self.callbacks[requestId])) {
                let callback = self.callbacks[requestId];
                delete self.callbacks[requestId];
                callback.resolve(data);
            } else {
                console.log('Request without callback: ', msg.action, msg.data);
            }
            console.log('Proxied objects: ', self.objects);
            console.log('Proxied lists: ', self.lists);
        }
        
        
        self.socket.listen('hfos.events.objectmanager', handleResponse);
        
        this.searchItems = function (schema, search, fields, fulltext) {
            console.log('[OP] Async-getting list for schema ', schema, search);
            
            if (typeof search === 'undefined') {
                search = '';
            }
            
            let reqid = self.getRequestId();
            
            if (typeof search === 'undefined') {
                search = '';
            }
            
            self.socket.send({
                'component': 'hfos.events.objectmanager',
                'action': 'search',
                'data': {
                    'req': reqid,
                    'schema': schema,
                    'search': search,
                    'fields': fields,
                    'fulltext': fulltext
                }
            });
            
            let deferred = self.q.defer();
            self.callbacks[reqid] = deferred;
            
            let query = deferred.promise.then(function (response) {
                console.log('OP ASYNC Delivering:', response);
                function compare(a, b) {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                }
                
                if (response.length > 0 && typeof response[0].name !== 'undefined') {
                    response.sort(compare);
                }
                return {data: response};
            });
            
            return query;
        };
        
        this.get = function(schema, uuid) {
            console.log('[OP] Async-getting object ', schema, uuid);
            
            let reqid = self.getRequestId();
            
            self.socket.send({
                'component': 'hfos.events.objectmanager',
                'action': 'get',
                'data': {
                    'req': reqid,
                    'schema': schema,
                    'uuid': uuid
                }
            });
    
            let deferred = self.q.defer();
            self.callbacks[reqid] = deferred;
    
            let query = deferred.promise.then(function (response) {
                console.log('[OP] Get response:', response);
                return response;
            });
    
            return query;
        };
    
        this.put = function(schema, obj) {
            console.log('[OP] Async-putting object ', schema, obj);
        
            let reqid = self.getRequestId();
        
            self.socket.send({
                'component': 'hfos.events.objectmanager',
                'action': 'put',
                'data': {
                    'req': reqid,
                    'schema': schema,
                    'obj': obj
                }
            });
        
            let deferred = self.q.defer();
            self.callbacks[reqid] = deferred;
        
            let query = deferred.promise.then(function (response) {
                console.log('[OP] Get response:', response);
                return response;
            });
        
            return query;
        };
    }
    
    getRequestId() {
        return this.requestId++;
    }
    
    getObject(schema, uuid, subscribe, filter) {
        console.log('[OP] Fetching object ', schema, uuid);
        this.socket.send({
            'component': 'hfos.events.objectmanager',
            'action': 'get',
            'data': {'schema': schema, 'uuid': uuid, 'subscribe': subscribe, 'filter': filter}
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
        this.socket.send({'component': 'hfos.events.objectmanager', 'action': 'subscribe', 'data': uuid});
    }
    
    unsubscribeObject(uuid) {
        console.log('[OP] Unsubscribing to object ', uuid);
        this.socket.send({'component': 'hfos.events.objectmanager', 'action': 'unsubscribe', 'data': uuid});
    }
    
    changeObject(schema, obj, change) {
        console.log('[OP] Changing object ', schema, obj, change);
        this.socket.send({
            'component': 'hfos.events.objectmanager',
            'action': 'change',
            'data': {'uuid': obj, 'schema': schema, 'change': change}
        });
    }
    
    putObject(schema, obj) {
        console.log('[OP] Putting object ', schema, obj);
        this.socket.send({'component': 'hfos.events.objectmanager', 'action': 'put', 'data': {'schema': schema, 'obj': obj}});
    }
    
    putObjectChange(schema, obj) {
        console.log('[OP] Putting object change', schema, obj);
    
        console.log('OLD:', obj, 'NEW:', this.objects[obj.uuid]);
        
        let uuid = obj.uuid;
        
        let change = {
            time: new Date().toISOString(),
            diff: jsondiffpatch.diff(obj, this.objects[uuid])
        };
        
        let data = {
            schema: schema,
            uuid: uuid,
            change: change
        };
        
        this.socket.send({
            component: 'hfos.events.objectmanager',
            action: 'putchangeset',
            data: data
        });
    }
    
    deleteObject(schema, uuid) {
        console.log('[OP] Deleting object ', schema, uuid);
        this.socket.send({'component': 'hfos.events.objectmanager', 'action': 'delete', 'data': {'schema': schema, 'uuid': uuid}});
    }
    
    
    getList(schema, filter, fields) {
        console.log('[OP] Getting object list ', schema, filter, fields);
        console.log('LEGACY LIST OPERATION');
        this.socket.send({
            'component': 'hfos.events.objectmanager',
            'action': 'list',
            'data': {
                'schema': schema,
                'filter': filter,
                'fields': fields
            }
        });
    }
    
    list(name) {
        console.log('LEGACY LIST ACCESS');
        return this.lists[name];
    }
    
    lists() {
        console.log('LEGACY GLOBAL LIST ACCESS');
        return this.lists;
    }
}

ObjectProxy.$inject = ['$q', 'socket', 'schemata', '$rootScope'];

export default ObjectProxy;

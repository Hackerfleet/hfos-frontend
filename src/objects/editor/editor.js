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

class objecteditor {

    constructor($scope, $stateParams, objectproxy, user, socket, schemata, $rootscope, alert) {
        console.log('[OE] STATEPARAMS: ', $stateParams);
        console.log('[OE] SCOPE: ', $scope);
        console.log('FOOBAR:', this.foobar);
        this.objectproxy = objectproxy;
        this.scope = $scope;
        if (typeof this.schema === 'undefined') {
            this.schemaname = $stateParams.schema;
        } else {
            this.schemaname = this.schema;
        }

        console.log('[OE] Handling object of type: ', this.schemaname);

        if (typeof this.uuid === 'undefined') {
            this.uuid = $stateParams.uuid;
        }

        if (typeof this.action === 'undefined') {
            this.action = $stateParams.action;
        }

        console.log('[OE] UUID: ', this.uuid, 'Action:', this.action);

        this.socket = socket;
        this.schemata = schemata;
        this.rootscope = $rootscope;
        this.alert = alert;

        this.schemascreenname = this.schemaname.charAt(0).toUpperCase() + this.schemaname.slice(1);
        this.schemadata = {};
        this.model = {};


        if (this.uuid.toUpperCase() === 'CREATE') {
            this.action = 'Create';
            $('#objModified').removeClass('hidden');
        } else {
            this.action = 'Edit';
        }

        var self = this;


        this.markStored = function() {
            console.log('[OE] Marking object as stored.');
            $('#objStored').removeClass('hidden');
            $('#objModified').addClass('hidden');
            self.action = 'Edit';
            self.alert.add('success', 'Editor', 'Object successfully stored.', 5);
        };

        this.rootscope.$on('OP.Put', function (ev, uuid) {
            if (uuid === self.uuid) {
                self.markStored();
            } else if (self.uuid.toUpperCase() === 'CREATE') {
                // TODO: What if another object is being created right now?
                // We could check if the object body is the same.
                // (Works bad on objects that are somehow modified before saving them)
                self.uuid = uuid;
                self.markStored();
            }
        });


        this.rootscope.$on('OP.Get', function (ev, uuid) {
            self.updateModel(uuid);
        });

        this.rootscope.$on('OP.Update', function (ev, uuid) {
            self.updateModel(uuid);
        });

        function getData() {
            console.log('[OE] Requesting schemata for ', self.schemaname);
            self.schemadata = self.schemata.get(self.schemaname);
            if (self.action !== 'Create') {
                console.log('[OE] Requesting object.');
                self.objectproxy.getObject(self.schemaname, self.uuid, true);
            }
        }

        this.rootscope.$on('User.Login', function () {
            console.log('[OE] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            getData();
        });

        this.rootscope.$on('Schemata.Update', function () {
            console.log('[OE] Schema update.');
            var newschema = self.schemata.schema(self.schemaname);
            console.log('[OE] Got a schema update:', newschema);
            self.schemadata = self.schemata.get(self.schemaname);
            // TODO: getData?
            getData();
        });

        if (user.signedin) {
            getData();
        }
    }

    fieldChange(model, form) {
        console.log('Fieldchange called! ', model, form);
    }


    callBackSD(schema) {
        console.log('[OE] Callback getting entries: ', schema);
        var origlist = this.objectproxy.lists[schema];
        console.log('[OE] Callback results: ', origlist);
        return origlist;

    }

    getFormData(options, search, foo) {
        console.log('[OE] Trying to obtain proxy list.', options, search, foo);
        if (search === '') {
            console.log(options.scope.insidemodel);
        }
        var result = this.objectproxy.newgetlist(options.type, search);
        console.log(result);
        return result;
    }

//console.log("[OE] CB Results: ", this.Callback('mapview'));


    formAction(target, action, uuid) {
        console.log('[OE] FormAction initiated: ', target, action, uuid);

        this.socket.send({
            'component': target,
            'action': action,
            'data': uuid
        });
    }

    updateModel(uuid) {
        console.log('[OE] Object has been updated from node, checking..', uuid);

        // TODO: This could fail and possibly catch the wrong object
        if (this.uuid === 'create') {
            this.uuid = uuid;
        }

        if (uuid === this.uuid) {
            console.log('[OE] Object changed, updating content.');
            this.model = this.objectproxy.objects[uuid];
            console.log('[OE] Object model: ', this.model);
            $('#objectModified').addClass('hidden');
            $('#objectEditButton').removeClass('hidden');
            this.scope.$apply();
        }
    }


    /*var editorChange = function () {
     if (this.model !== objectproxy.obj[this.uuid]) {
     console.log('[OE] Content has been modified locally.');

     $('#objectModified').removeClass('hidden');
     } else {
     console.log('[OE] Content changed from somewhere else.');
     console.log(this.model, objectproxy.obj[this.uuid]);
     }
     };

     this.$watchCollection('model', editorChange);
     */

    submitObject() {
        let model = this.model;
        if (this.action.toUpperCase() === 'CREATE') {
            model.uuid = 'create';
        }
        console.log('[OE] Object update initiated with ', model);
        this.objectproxy.putObject(this.schemaname, model);
    }

    deleteObject() {
        let model = this.model;
        if (this.action.toUpperCase() === 'CREATE') {
            model.uuid = 'create';
            this.alert.add('warning', 'Editor', 'Cannot delete object - it is not stored yet.');
            return;
        }
        console.log('[OE] Object deletion initiated with ', this.uuid);
        this.objectproxy.delObject(this.schemaname, this.uuid);
    }
}

objecteditor.$inject = ['$scope', '$stateParams', 'objectproxy', 'user', 'socket', 'schemata', '$rootScope', 'alert'];

export default objecteditor;

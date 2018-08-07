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

class objectlist {
    constructor($stateParams, $rootScope, schemata, objectproxy, user, notification, socket) {
        this.rootscope = $rootScope;
        this.schemata = schemata;
        this.objectproxy = objectproxy;
        this.user = user;
        this.notification = notification;
        this.socket = socket;

        this.schemaname = $stateParams.schema;

        this.schemascreenname = this.schemaname.charAt(0).toUpperCase() + this.schemaname.slice(1);

        this.schemadata = {};
        this.filter = {};
        this.fields = ['name', 'uuid', 'perms', 'owner'];

        this.objectlistdata = {};
        this.objectlisttoggles = {};

        this.select_state = false;
        this.selected_permissions = {};

        if (user.signedin) {
            this.getData();
        }

        let self = this;

        this.rootscope.$on('User.Login', function () {
            console.log('[OE] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            self.getData();
        });

        this.rootscope.$on('Schemata.Update', function () {
            let newschema = self.schemata.schema(self.schemaname);
            console.log('[OL] Got a schema update:', newschema);
            self.schemadata = self.schemata.get(self.schemaname);
            // TODO: getData?
        });

        this.rootscope.$on('OP.ListUpdate', function (ev, schema) {
            console.log('[OL] Objectmanager got a new list for ', schema);
            if (self.schemaname === schema) {
                console.log('[OL] Received an object list');

                self.objectlisttoggles = {};
                self.objectlistdata = {};

                for (let item of self.objectproxy.list(schema)) {
                    self.objectlisttoggles[item.uuid] = false;
                    self.objectlistdata[item.uuid] = item;
                }
            }
        });

        this.socket.listen('hfos.events.objectmanager', function(msg) {
            if (msg.action === 'delete') {
                delete self.objectlistdata[msg.data.uuid];
                delete self.objectlisttoggles[msg.data.uuid];
            }
        });
    }

    unselect() {
        for (let uuid of Object.keys(this.objectlisttoggles)) {
            this.objectlisttoggles[uuid] = false;
        }

        this.selected_objects = [];
    }

    reveal() {
        console.log(this);
        console.log(this.objectlistdata);
    }

    del(uuid) {
        console.log('[OE] Deleting object: ', uuid);
        this.objectproxy.deleteObject(this.schemaname, uuid);

        if (uuid.constructor === Array) {
            this.unselect();
        }
    }

    remove_role(uuid, action, role) {
        console.log('[OL] Removing role:', uuid, action, role);

        if (['admin', 'owner', 'system'].indexOf(role) >= 0) {
            this.notification.add('warning', 'Cannot revoke', 'Admin and owner permissions cannot be revoked.', 5);
            return
        }

        let self = this;

        this.socket.send({
            component: 'hfos.events.objectmanager',
            action: 'remove_role',
            data: {
                schema: self.schemaname,
                uuid: uuid,
                action: action,
                role: role
            }
        })
    }

    add_role(uuid, action, role) {
        console.log('[OL] Adding role:', uuid, action, role);

        if (['admin', 'owner', 'system'].indexOf(role) >= 0) {
            this.notification.add('warning', 'Cannot add', 'Admin and owner permissions cannot be added.', 5);
            return
        }

        let self = this;

        this.socket.send({
            component: 'hfos.events.objectmanager',
            action: 'add_role',
            data: {
                schema: self.schemaname,
                uuid: uuid,
                action: action,
                role: role
            }
        })
    }

    select_objects() {
        this.selected_objects = [];

        let self = this;

        function update_selected_perms(obj) {
            for (let action of ['write', 'read', 'list']) {
                for (let role of obj.perms[action]) {
                    if (self.selected_permissions[action].indexOf(role) < 0) {
                        self.selected_permissions[action].push(role)
                    }
                }
            }
        }

        this.selected_permissions = {
            write: [],
            read: [],
            list: []
        };

        for (let uuid of Object.keys(this.objectlisttoggles)) {
            if (this.objectlisttoggles[uuid] === true) this.selected_objects.push(uuid);
            update_selected_perms(this.objectlistdata[uuid]);
        }
    }

    select_all() {
        console.log('[OL] Selecting all items');
        this.select_state = !this.select_state;

        for (let uuid of Object.keys(this.objectlisttoggles)) {
            this.objectlisttoggles[uuid] = this.select_state;
        }

        this.select_objects();
    }

    getData() {
        console.log('[OL] Requesting ObjectList.');
        this.schemadata = this.schemata.get(this.schemaname);
        this.objectproxy.getList(this.schemaname, this.filter, this.fields);
    }

}

objectlist.$inject = ['$stateParams', '$rootScope', 'schemata', 'objectproxy', 'user', 'notification', 'socket'];

export default objectlist;

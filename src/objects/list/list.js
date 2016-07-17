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

class objectlist {

    constructor($stateParams, $rootScope, schemata, objectproxy, user) {
        this.rootscope = $rootScope;
        this.schemata = schemata;
        this.objectproxy = objectproxy;
        this.user = user;

        this.schemaname = $stateParams.schema;

        this.schemascreenname = this.schemaname.charAt(0).toUpperCase() + this.schemaname.slice(1);

        this.schemadata = {};
        this.filter = {};
        this.fields = {};

        this.objectlistdata = {};

        if (user.signedin) {
            this.getData();
        }

        var self = this;

        this.rootscope.$on('User.Login', function () {
            console.log('[OE] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            self.getData();
        });

        this.rootscope.$on('Schemata.Update', function () {
            var newschema = self.schemata.schema(self.schemaname);
            console.log('[OL] Got a schema update:', newschema);
            self.schemadata = self.schemata.get(self.schemaname);
            // TODO: getData?
        });

        this.rootscope.$on('OP.ListUpdate', function (ev, schema) {
            console.log('[OL] Objectmanager got a new list for ', schema);
            if (self.schemaname === schema) {
                console.log('[OL] Received an object list');
                self.objectlistdata = self.objectproxy.list(schema);
                console.log('[OL] Data: ', self.objectlistdata);
            }
        });
    }

    reveal() {
        console.log(this);
        console.log(this.objectlistdata);
    }

    del(uuid) {
        console.log('[OE] Deleting object: ', uuid);
        this.objectproxy.del(this.schemaname, uuid);
    }

    getData() {
        console.log('[OL] Requesting ObjectList.');
        this.schemadata = this.schemata.get(this.schemaname);
        this.objectproxy.getList(this.schemaname, this.filter, this.fields);
    }

}

objectlist.$inject = ['$stateParams', '$rootScope', 'schemata', 'objectproxy', 'user'];

export default objectlist;

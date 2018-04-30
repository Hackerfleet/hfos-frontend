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

'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.schemata
 * @description
 * # schemata
 * Service in the hfosFrontendApp.
 */

class SchemataService {

    constructor($socket, $rootScope) {
        console.log('[SCHEMATA] SchemataService initializing.');
        // AngularJS will instantiate a singleton by calling "new" on this function
        this.socket = $socket;
        this.rootscope = $rootScope;
        this.schemata = null;
        this.configschemata = null;

        let self = this;

        function updateschemata() {
            console.log('[SCHEMATA] Getting update of schemata.');
            self.socket.send({'component': 'hfos.events.schemamanager', 'action': 'all'});
        }

        function registerschemata(msg) {
            // Schemata reception hook

            console.log('[SCHEMATA] Schemata interaction:', msg.action);

            if (msg.action === 'all') {
                self.schemata = msg.data;
                console.log('[SCHEMATA] New schemata received:', self.schemata);
                self.rootscope.$broadcast('Schemata.Update');
            } else if (msg.action === 'configuration') {
                    self.configschemata = msg.data;
                    console.log('[SCHEMATA] New configuration schemata received:', self.configschemata);
                    self.rootscope.$broadcast('Schemata.ConfigUpdate');
                }

        }

        this.socket.listen('hfos.events.schemamanager', registerschemata);
        this.rootscope.$on('User.Login', updateschemata);

        /*if (this.user.signedin === true) {
            updateschemata();
        }*/

    }

    updateconfigschemata() {
        console.log('[SCHEMATA] Getting update of schemata.');
        this.socket.send({component: 'hfos.events.schemamanager', action: 'configuration'});
    }

    get(schemaname) {
        console.log('[SCHEMATA] Full schema requested: ');
        console.log(schemaname, this.schemata[schemaname]);
        return this.schemata[schemaname];
    }

    schema(schemaname) {
        console.log('[SCHEMATA] Schema requested: ', schemaname);
        console.log(this.schemata, schemaname);
        console.log(schemaname, this.schemata[schemaname].schema);
        //if (this.user.signedin) {
            return this.schemata[schemaname].schema;
        /*} else {
            console.log('[SCHEMATA] But we are not logged in!');
        }*/
    }

    form(schemaname) {
        console.log('[SCHEMATA] Form requested: ');
        console.log(schemaname, this.schemata[schemaname].form);
        return this.schemata[schemaname].form;
    }

    check() {
        console.log('[SCHEMATA]', this.schemata);
    }

}


SchemataService.$inject = ['socket', '$rootScope'];

export default SchemataService;

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
 * Created by riot on 21.02.16.
 */


class SystemconfigService {

    constructor(rootscope, objectproxy, modal) {
        console.log('[SYS] SystemconfigService constructing');
        this.rootscope = rootscope;
        this.op = objectproxy;
        this.modal = modal;

        this.config = null;
        this.nodename = 'Node';

        console.log('[SYS] SystemconfigService constructed');

        let self = this;

        function updateConfig() {
            console.log('[SYS] Getting system config.');
            self.op.get('systemconfig', '', true, {active: true})
                .then(function (msg) {
                    if (msg.action === 'get') {
                        let obj = msg.data.object;
                        console.log('[SYS] Systemconfiguration received!');
                        self.config = obj;
                        self.nodename = obj.name;
                        self.rootscope.$broadcast('System.Config', obj);
                    }
                });
        }

        rootscope.$on('User.Login', function (ev) {
            updateConfig();
        });
    }
}

SystemconfigService.$inject = ['$rootScope', 'objectproxy', '$modal'];

export default SystemconfigService;

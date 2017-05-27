/*
 *
 * __license__ = """
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011- $DateInfo.year riot <riot@c-base.org> and others.
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
 * """
 */

'use strict';
/*
 * Hackerfleet Operating System
 * =====================================================================
 * Copyright (C) 2011-2016 riot <riot@c-base.org> and others.
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
 * Created by riot on 21.02.16.
 */


class SystemconfigService {

    constructor(rootscope, user, objectproxy, alert, modal) {
        console.log('[SYS] SystemconfigService constructing');
        this.rootscope = rootscope;
        this.user = user;
        this.op = objectproxy;
        this.alert = alert;
        this.modal = modal;

        this.config = null;

        console.log('[SYS] SystemconfigService constructed');

        let self = this;

        function updateConfig() {
            console.log('[SYS] Getting system config.');
            self.op.getObject('systemconfig', '', true, {active: true})
        }

        rootscope.$on('User.Login', function(ev) {
            updateConfig();
        });

        if (user.signedin === true) {
            updateConfig();
        }

        rootscope.$on('OP.Get', function(event, objuuid, obj, schema) {
            console.log('[SYS] Listened to: ', schema, obj);
            if (schema == 'systemconfig' && obj.active == true) {
                console.log('[SYS] Systemconfiguration received!');
                self.config = obj;
                self.rootscope.$broadcast('System.Config', obj);
            }
        });

    }

}

SystemconfigService.$inject = ['$rootScope', 'user', 'objectproxy', '$alert', '$modal'];

export default SystemconfigService;

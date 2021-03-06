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

let showAngularStats = require('ng-stats');
//showAngularStats();

class AboutComponent {

    constructor(rootscope, user, socket, $interval, notification, modal, schemaservice, op, state, localStorageService,
                systemconfig, gettextCatalog) {
        this.rootscope = rootscope;
        this.user = user;
        this.socket = socket;
        this.notification = notification;
        this.modal = modal;
        this.$interval = $interval;
        this.state = state;
        this.schemaservice = schemaservice;
        this.storage = localStorageService;
        this.systemconfig = systemconfig;
        this.gettextCatalog = gettextCatalog;

        this.schemata = [];

        this.commitHash = __COMMIT_HASH__;

        this.serverport = socket.port;
        this.ssloverride = socket.protocol === 'wss';

        this.counter = 0;
        this.consoleinput = '';

        $('#path').css({fill: '#afafff'});

        this.testOptions = {
            max: 10,
            min: 1,
            step: 1,
            value: 5
        };
        this.sliderValue = 5;
        this.colorValue = "";
        this.datetimeValue = new Date();

        let self = this;

        if (this.user.debug) {
            console.log('[ABOUT] Opening debug tab:', this.user.debug);
            this.toggleDebug();
            this.opentab(this.storage.get('debugTab'));
        }
    }

    increment() {
        this.counter++;
    }

    command(cmd) {
        this.socket.send({
            'component': 'hfos.events.system',
            'action': 'debugrequest',
            'data': cmd
        });
        let msg = 'Sent: ' + cmd;

        this.notification.add('info', 'Debugger', msg, 5);
    }

    toggleDebug() {
        console.log('[ABOUT] Toggling Debug tools');
        if (this.user.debug !== true) {
            this.user.debug = true;
            showAngularStats({
                position: 'bottom',
                htmlId: 'ngstats'

            });
        } else {
            this.user.debug = false;
        }
        this.gettextCatalog.debug = this.user.debug;
    }

    opentab(tabname) {
        console.log('[ABOUT] Switching tab to ', tabname);
        // TODO: De-jquery this (also somewhere else, e.g. dashboard)
        $('.nav-pills .active, .tab-content .active').removeClass('active');
        $('#' + tabname).addClass('active');
        this.storage.set('debugTab', tabname);
    }

    viewlist(schema) {
        this.state.go('app.list', {schema: schema});
    }

    setserverport() {
        console.log('[ABOUT] Updating server port to ', this.serverport, this.ssloverride);
        this.socket.setPort(this.serverport, this.ssloverride);
    }

    changeport(ev) {
        console.log('CHANGE HANDLER CALLED', ev);
        if (this.serverport === 443) {
            this.ssloverride = true;
        }
    }

    unsetserverport() {
        console.log('[ABOUT] Removing server port override');
        this.socket.unsetPort();
    }

    sendcommand() {
        this.command(this.consoleinput);
    }

    memdebug() {
        this.command('memdebug');
    }

    graph() {
        this.command('graph');
    }

    testAlert() {
        this.notification.add('warning', 'Caption', 'Alert text', 0);
    }

}

AboutComponent.$inject = [
    '$rootScope', 'user', 'socket', '$interval', 'notification', '$modal', 'schemata',
    'objectproxy', '$state', 'localStorageService', 'systemconfig', 'gettextCatalog'
];

export default AboutComponent;

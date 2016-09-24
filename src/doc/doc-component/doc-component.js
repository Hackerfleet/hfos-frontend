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

class DocComponent {

    constructor() {
    }

    updateStats() {
        //console.log("Update: ", this.socket);
        var stats = this.socket.stats;
        this.stats = {
            rx: stats.rx,
            tx: stats.tx,
            start: stats.start,
            lag: 'N/A'
        };
    }

    command(cmd) {
        this.socket.send({
            'component': 'debugger',
            'action': cmd,
            'data': ''
        });
        var msg = 'Sent: ' + cmd;

        this.alert.add('info', 'Debugger', msg, 500);
    }

    enableDebug() {
        if (this.updater === false) {
            $('#debug').removeClass('hidden');
            this.updateStats();
            this.updater = this.$interval(() => this.updateStats(), 1000);
        } else {
            $('#debug').addClass('hidden');
            this.$interval.cancel(this.updater);
            this.updater = false;
        }
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

}

DocComponent.$inject = ['socket', '$interval', 'alert', '$modal', 'schemata', 'objectproxy'];

export default DocComponent;

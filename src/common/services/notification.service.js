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
 * Created by riot on 21.02.16.
 */


class NotificationService {

    constructor(socket, alert, modal, statusbar) { //$rootScope, $interval, socket, createDialog, $alert) {
        console.log('NotificationService constructing');
        this.socket = socket;
        this.alert = alert;
        this.modal = modal;
        this.statusbar = statusbar;

        let self = this;

        function remoteAlert(msg) {
            if (msg.action === 'notify') {
                console.log('[NOTIFY] Service remote alert: ');
                let title = 'Remote Alert';
                let duration = 10;
                let message;
                let types = ['danger', 'info', 'success', 'warning'];

                let type = msg.data.type;
                if (types.indexOf(type) < 0) {
                    type = 'info';
                }

                if ('title' in msg.data) {
                    title = msg.data.title;
                }

                if ('duration' in msg.data) {
                    duration = msg.data.duration;
                }

                message = msg.data.message;

                self.add(type, title, message, duration);
            }
        }

        this.socket.listen('hfos.alert.manager', remoteAlert);
        console.log('[NOTIFY] NotificationService constructed');

    }

    add(type, title, msg, duration) {
        console.log('[NOTIFY] Emitting new alert');

        this.alert({
            'title': title,
            'content': msg,
            'placement': 'top-left',
            'type': type,
            'show': true,
            'duration': duration
        });

        this.statusbar.add(type, title, msg);
    }
}

NotificationService.$inject = ['socket', '$alert', '$modal', 'statusbar'];

export default NotificationService;

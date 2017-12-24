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


class SystemlogComponent {

    constructor(rootscope, user, objectproxy, socket, $interval, notification, NgTableParams) {
        this.rootscope = rootscope;
        this.user = user;
        this.op = objectproxy;
        this.socket = socket;
        this.notification = notification;
        this.$interval = $interval;

        this.messages = [];
        this.emitters = [];

        this.show_filter = true;

        let self = this;

        this.rootscope.$on('User.Login', function (event) {
            console.log('[SYSLOG] Checking logs', self.user.account);
            if (self.user.account.roles.indexOf('admin') > 0) {
                self.get_log_messages();
                self.subscribe();
            }
        });

        if (this.user.signedin === true) {
            this.get_log_messages();
            this.subscribe();
        }


        socket.listen('hfos.ui.syslog', function (msg) {
            if (msg.action === 'history') {
                console.log('[SYSLOG] Got a history update', msg.data);
                let known_emitters = [];
                self.emitters.splice(0, self.emitters.length);
                self.emitters.push({title: "All"});
                for (let message of msg.data.history) {
                    self.messages.push(message);

                    if (known_emitters.indexOf(message.emitter) === -1) {
                        known_emitters.push(message.emitter);
                        self.emitters.push({
                            id: message.emitter,
                            title: message.emitter
                        });
                    }
                }
                console.log('[SYSLOG]', self.emitters);
            } else if (msg.action === 'update') {
                console.log('[SYSLOG] Got a new log message');
                self.messages.push(msg.data);
            }

            self.tableParams = new NgTableParams(
                {},
                {
                    dataset: self.messages
                }
            );
        });

        this.subscribe = function() {
            let packet = {
                component: 'hfos.ui.syslog',
                action: 'subscribe'
            };
            self.socket.send(packet);
        };

        this.get_log_messages = function () {
            console.log('[SYSLOG] Requesting history');
            let timestamp = new Date() / 1000;
            console.log(this.messages);
            /*if (Object.keys(this.messages).length > 0) {
             console.log('[SYSLOG] There are old messages in the list:', this.messages);
             timestamp = Math.min.apply(Math, Object.keys(this.messages));
             }*/

            console.log('[SYSLOG] Earliest timestamp is:', timestamp);
            let packet = {
                component: 'hfos.ui.syslog',
                action: 'history',
                data: {
                    end: timestamp,
                    limit: 50
                }
            };
            this.socket.send(packet);
        };


        console.log('[SYSLOG] RUNNING');
    }
}

SystemlogComponent.$inject = ['$rootScope', 'user', 'objectproxy', 'socket', '$interval', 'notification', 'NgTableParams'];

export default SystemlogComponent;

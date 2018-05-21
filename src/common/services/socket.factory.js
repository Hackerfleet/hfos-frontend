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

/**
 * Created by riot on 21.02.16.
 */

let humanizeDuration = require('humanize-duration');
import * as _ from 'lodash';

class SocketService {

    constructor($location, $alert, $timeout, $interval, $cookies, $rootscope, statusbar) {
        // TODO: Switch to notification service instead of using $alert
        // TODO: Repair reconnection facility

        console.log('[SOCKET] SocketService constructing');
        this.$alert = $alert;
        this.$timeout = $timeout;
        this.$interval = $interval;
        this.cookies = $cookies;
        this.rootscope = $rootscope;
        this.statusbar = statusbar;
        //this.humanizer = humanizer;
        this.host = $location.host();
        this.port = $location.port();
        this.protocol = 'wss';

        if ($location.protocol() !== 'https') {
            this.protocol = 'ws';
            console.warn('[SOCKET] Running on insecure protocol!');
            $('#hfos-icon').addClass('icon-glow-red');
        }

        this.websocketurl = this.protocol + '://' + this.host;
        if ((this.protocol === 'wss' && this.port !== 443) || (this.protocol === 'ws' && this.port !== 80)) {
            this.hostname += ':' + this.port;
        }

        this.websocketurl += '/websocket';

        console.info('[SOCKET] Websocket url', this.websocketurl);

        this.sock = new WebSocket(this.websocketurl);

        this.connected = false;
        this.stayonline = true;
        this.trying = false;
        this.reconnecttries = 0;
        this.disconnectalert = '';
        this.handlers = {'profile': []};
        this.stats = {
            rx: 0,
            tx: 0,
            start: 0,
            latency: 0
        };
        this.disconnectalert = $alert({
            'title': 'Offline',
            'placement': 'top-left',
            'type': 'warning',
            'show': false
        });
        this.pingTimer = null;

        let self = this;

        let cookie = this.cookies.get('hfosclient-dev');
        if (typeof cookie !== 'undefined') {
            let json = JSON.parse(cookie);
            if (typeof json.port !== 'undefined') {
                console.log('[SOCKET] Setting development port from cookie');
                self.port = +json.port;
                self.protocol = json.secure ? 'wss' : 'ws';
                if (json.secure) {
                    $('#hfos-icon').removeClass('icon-glow-red');
                }
                $('#hfos-icon').addClass('icon-glow-blue');
            }
        }

        function setPort(port, secure) {
            console.log('[SOCKET] Storing development port cookie:', port, secure);
            self.cookies.put('hfosclient-dev', JSON.stringify({port: port, secure: secure}));
            self.port = port;
            self.protocol = secure ? 'wss' : 'ws';
            self.reconnect();
            $('#hfos-icon').addClass('icon-glow-blue');
        }

        function unsetPort() {
            console.log('[SOCKET] Unsetting development port cookie');
            // TODO: If we decide to store more in that, we should only delete the port keyword
            self.cookies.remove('hfosclient-dev');
            $('#hfos-icon').removeClass('icon-glow-blue');
            self.port = $location.port();
            self.secure = $location.protocol === 'https';
            self.reconnect();
        }

        this.setPort = setPort;
        this.unsetPort = unsetPort;

        function doReconnect() {
            if (self.connected !== true && self.trying !== true) {
                console.warn('[SOCKET] Trying to reconnect.');
                self.sock.close();
                self.websocketurl = self.protocol + '://' + self.host + ':' + self.port + '/websocket';

                self.sock = new WebSocket(self.websocketurl);
                self.sock.onopen = self.OpenEvent;
                self.sock.onclose = self.CloseEvent;
                self.sock.onmessage = self.receive;

                self.reconnecttries++;
                self.trying = true;

                let interval = Math.min(30, Math.pow(self.reconnecttries, 2)) * 1000;

                self.disconnectalert.hide();

                self.disconnectalert = $alert({
                    'title': 'Offline',
                    'content': 'You have been disconnected from the node. Retry interval is at ' + humanizeDuration(interval),
                    'placement': 'top-left',
                    'type': 'warning',
                    'show': true,
                    'duration': interval / 1000
                });

                let color = function (value) {
                    return '#FF' + parseInt((1 - value) * 255).toString(16) + '00';
                };

                $('#btnhome').css('color', color(interval / 30000));

                self.reconnecttimer = self.$timeout(self.doReconnect, interval);
            }
        }

        this.doReconnect = doReconnect;

        function OpenEvent() {
            console.log('[SOCKET] Websocket successfully opened!');
            self.connected = true;
            self.stayonline = true;
            self.trying = false;
            self.reconnecttries = 0;

            if (self.disconnectalert !== '') {
                self.disconnectalert.hide();
            }

            let currentdate = new Date();
            $('#btnhome')
                .css('color', '#3a75a8')
                .prop('title', 'Connected since ' + currentdate);
            $('#btnuser').removeClass('hidden').css('color', '');

            self.stats.start = currentdate;

            self.disconnectalert = self.$alert({
                'title': 'Online',
                'content': 'The connection to the node has been established. You\'re online!',
                'placement': 'top-left',
                'type': 'info',
                'show': true,
                'duration': 5
            });

            if (self.pingTimer === null) self.pingTimer = self.$interval(self.ping, 30000);


            self.rootscope.$broadcast('Client.Connect');
        }

        this.OpenEvent = OpenEvent;

        function finallyClosed() {
            console.warn('[SOCKET] Something closed the websocket!');
            self.connected = false;
            $('#btnhome').css('color', 'red');

            self.hideElements();
            self.rootscope.$broadcast('Client.Disconnect');
        }

        this.finallyClosed = finallyClosed;

        function CloseEvent() {
            console.info('[SOCKET] Close event called.');

            self.connected = false;

            self.$interval.cancel(self.pingTimer);
            self.pingTimer = null;

            let currentdate = new Date();

            $('#btnhome').prop('title', 'Disconnected since ' + currentdate);

            self.hideElements();
            self.rootscope.$broadcast('Client.Connectionloss');

            if (self.trying === true) {
                console.info('[SOCKET] Already trying');
                self.trying = false;
                return;
            }
            if (self.stayonline === true) {
                self.doReconnect();
            } else {
                self.finallyClosed();
            }
        }

        this.CloseEvent = CloseEvent;

        function receive(packedmsg) {
            $('#ledincoming').css({'color': 'red'});

            function reset() {
                $('#ledincoming').css({'color': 'green'});
            }

            self.$timeout(reset, 250);
            console.debug('Raw message received: ', packedmsg);
            let msg = JSON.parse(packedmsg.data);

            console.debug('[SOCKET] Parsed message: ', msg, self.handlers);

            self.stats.rx++;

            if (_.has(msg, 'component')) {
                if (_.has(msg, 'action')) {
                    //console.info('Correct message received. Handlers: ', self.handlers, msg.component);
                    if (msg.component in self.handlers) {
                        //console.info('Found a matching handler.');
                        for (let handler in self.handlers[msg.component]) {
                            //console.info('Calling handler:', self.handlers[msg.component], handler);
                            self.handlers[msg.component][handler](msg);
                        }
                        /*_.forIn(handlers[msg.compoennt], function (value, key) {
                         console.info('Executing handler: ', value, key, msg);
                         key(msg);
                         });*/
                    }
                } else {
                    console.error('Incorrect message: no action!', msg);
                }
            } else {
                console.error('Incorrect message: component!', msg);
            }
        }

        this.receive = receive;

        // TODO: Remove this, it is now part of the filemanager module
        function sendFile(file, component, action) {
            let reader = new FileReader();
            let raw = new ArrayBuffer();

            reader.loadend = function () {
                console.info('[SOCKET] SendFile: Load end');
            };

            reader.onload = function (e) {
                console.info('[SOCKET] SendFile event:', e);
                raw = e.target.result;
                let msg = JSON.stringify(
                    {
                        'component': component,
                        'action': action,
                        'data': {
                            'name': file.name,
                            'raw': window.btoa(raw)
                        }
                    }
                );
                console.info('[SOCKET] MSG:', msg);
                self.sock.send(msg);
                console.log("[SOCKET] File has been transferred.");
            };

            reader.readAsBinaryString(file);

        }

        this.sendFile = sendFile;


        function ping() {
            if (self.connected) {
                console.debug('[SOCKET] Transmitting ping');
                let packet = {
                    component: 'hfos.ui.clientmanager',
                    action: 'ping',
                    data: new Date().getTime()
                };
                self.send(packet);
            }
        }
        this.ping = ping;

        this.sock.onopen = OpenEvent;
        this.sock.onclose = CloseEvent;
        this.sock.onmessage = receive;

        this.listen('hfos.ui.clientmanager', function (msg) {
            if (msg.action === 'Flooding') {
                console.warn('[SOCKET] Clientmanager wants us to stop flooding.');
            } else if (msg.action === 'pong') {
                self.stats.latency = new Date().getTime() - msg.data[0];
                console.debug('[SOCKET] Latency: ', self.stats.latency);
                if (self.stats.latency > 20) {
                    self.statusbar.add('danger', 'High latency', 'Roundtrip took ' + self.stats.latency + ' ms');
                }
                console.debug('[SOCKET] Stats:', self.stats);
            } else if (msg.action === 'Permission') {
                $alert({
                    'title': 'No permission',
                    'content': 'You have insufficient permissions to do that.',
                    'placement': 'top-left',
                    'type': 'warning',
                    'show': true,
                    'duration': 5
                });
            }
        });

        doReconnect();
    }

    reconnect() {
        this.doDisconnect();
        this.doReconnect();
    }

    hideElements() {
        $('#btnuser').addClass('hidden');
        // TODO: Mob button should rather be gray and recording the MOB alert for later,
        // if possible with phone-local GPS coords
    }

    send(msg) {
        let json = JSON.stringify(msg);
        if (json.indexOf('password') === -1 && json.length < 5000) {
            console.debug('[SOCKET] Transmitting msg: ', json);
        } else {
            console.debug('[SOCKET] Transmitting msg: *** (Too long or contains sensitive information)');
        }

        function reset() {
            $('#ledoutgoing').css({'color': 'green'});
        }

        try {
            this.sock.send(json);
            this.stats.tx++;

            $('#ledoutgoing').css({'color': 'red'});

            this.$timeout(reset, 250);
        } catch (e) {
            console.error('[SOCKET] Exception upon transmit: ', e);
        }
    }

    listen(topic, handler) {

        if (_.has(this.handlers, topic)) {
            this.handlers[topic].push(handler);
            console.debug('[SOCKET] New handler registered for topic ', topic);
        } else {
            this.handlers[topic] = [handler];
            console.debug('[SOCKET] First handler registered for topic ', topic);
        }

        console.debug(this.handlers);
    }

    unlisten(topic, handler) {
        console.info('[SOCKET] Trying to dismiss listener: ', topic, handler, this.handlers);
        if (typeof this.handlers[topic] !== 'undefined') {
            console.info('[SOCKET] Topic found!');
            if (this.handlers[topic].indexOf(handler) > -1) {
                console.info('[SOCKET] Unlisting handler for topic: ', topic);
                this.handlers[topic].splice(this.handlers[topic].indexOf(handler), 1);
            }
        }
        console.info('[SOCKET] Handlers after unlisten: ', this.handlers);
    }

    doDisconnect() {
        this.stayonline = false;
        this.sock.close();
        //hideElements();
    }

    check() {
        console.log('[SOCKET] Connection state: ', this.connected);

        if (this.connected) {
            console.log('[SOCKET] All nice, we are still connected');
        } else {
            console.log('[SOCKET] Reconnecting...');
            this.doReconnect();
        }
    }
}

SocketService.$inject = ['$location', '$alert', '$timeout', '$interval', '$cookies', '$rootScope', 'statusbar'];

export default SocketService;

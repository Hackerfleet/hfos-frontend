/*
 * Hackerfleet Operating System
 * =====================================================================
 * Copyright (C) 2011-2015 riot <riot@hackerfleet.org> and others.
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

var humanizeDuration = require('humanize-duration');
console.log(humanizeDuration(23000), "Also, i was used here.");
import * as _ from 'lodash';

class SocketService {

    constructor($location, $alert, $timeout, $rootscope) {
        console.log('SocketService constructing');
        this.$alert = $alert;
        this.$timeout = $timeout;
        this.rootscope = $rootscope;
        //this.humanizer = humanizer;
        console.log(humanizeDuration(55000));
        this.host = $location.host();
        this.port = 80;

        this.sock = new WebSocket('ws://' + this.host + ':' + this.port + '/websocket', 'HFOS');

        this.connected = true;
        this.stayonline = true;
        this.trying = false;
        this.reconnecttries = 0;
        this.disconnectalert = '';
        this.handlers = {'profile': []};
        this.stats = {
            rx: 0,
            tx: 0,
            start: 0,
            lag: 0
        };
        this.disconnectalert = $alert({
            'title': 'Offline',
            'placement': 'top-left',
            'type': 'warning',
            'show': false
        });

        var self = this;

        function doReconnect() {
            if (self.connected !== true && self.trying !== true) {
                console.log('[SOCKET] Trying to reconnect.');
                self.sock.close()
                self.sock = new WebSocket('ws://' + self.host + ':' + self.port + '/websocket', 'HFOS');
                self.sock.onopen = self.OpenEvent;
                self.sock.onclose = self.CloseEvent;
                self.sock.onmessage = self.receive;

                console.log("A");
                self.reconnecttries++;
                self.trying = true;

                var interval = Math.min(30, Math.pow(self.reconnecttries, 2));
                console.log("B");
                self.disconnectalert.hide();

                self.disconnectalert = $alert({
                    'title': 'Offline',
                    'content': 'You have been disconnected from the node. Retry interval is at ' + humanizeDuration(interval * 1000),
                    'placement': 'top-left',
                    'type': 'warning',
                    'show': true,
                    'duration': interval
                });

                var color = function (value) {
                    return '#FF' + parseInt((1 - value) * 255).toString(16) + '00'; // .toString(16);
                };
                console.log("C");
                $('#btnhome').css('color', color(interval / 30));

                self.reconnecttimer = self.$timeout(self.doReconnect, interval * 1000);
                //reconnecttimer = $interval(doReconnect, interval);
                console.log("D");
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

            var currentdate = new Date();
            document.getElementById('btnhome').title = 'Connected since ' + currentdate;
            self.stats.start = currentdate;

            self.disconnectalert = self.$alert({
                'title': 'Online',
                'content': 'The connection to the node has been established. You\'re online!',
                'placement': 'top-left',
                'type': 'info',
                'show': true,
                'duration': 5
            });

            $('#btnhome').css('color', '#3a75a8');
            $('#btnuser').removeClass('hidden').css('color', '');

            self.rootscope.$broadcast('Client.Connect');
        }

        this.OpenEvent = OpenEvent;

        function finallyClosed() {
            console.log('[SOCKET] Something closed the websocket!');
            self.connected = false;
            $('#btnhome').css('color', 'red');

            self.hideElements();
            self.rootscope.$broadcast('Client.Disconnect');
        }

        this.finallyClosed = finallyClosed;

        function CloseEvent() {
            console.log('[SOCKET] Close event called.');

            self.connected = false;

            var currentdate = new Date();

            document.getElementById('btnhome').title = 'Disconnected since ' + currentdate;
            //$('#btnhome').prop('title', 'Disconnected since ' + currentdate);

            self.hideElements();
            self.rootscope.$broadcast('Client.Connectionloss');

            if (self.trying === true) {
                console.log('[SOCKET] Already trying');
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
            //console.log('Raw message received: ', packedmsg);
            var msg = JSON.parse(packedmsg.data);

            //console.log('Parsed message: ', msg, self.handlers);

            if (_.has(msg, 'component')) {
                if (_.has(msg, 'action')) {
                    //console.log('Correct message received. Handlers: ', self.handlers, msg.component);
                    if (msg.component in self.handlers) {
                        //console.log('Found a matching handler.');
                        for (var handler in self.handlers[msg.component]) {
                            //console.log('Calling handler:');
                            self.handlers[msg.component][handler](msg);
                        }
                        /*_.forIn(handlers[msg.compoennt], function (value, key) {
                         console.log('Executing handler: ', value, key, msg);
                         key(msg);
                         });*/
                    }
                } else {
                    console.log('Incorrect message: no action!', msg);
                }
            } else {
                console.log('Incorrect message: component!', msg);
            }
        }

        this.receive = receive;

        this.sock.onopen = OpenEvent;
        this.sock.onclose = CloseEvent;
        this.sock.onmessage = receive;


    }


    hideElements() {
        $('#btnuser').addClass('hidden');
        // TODO: Mob button should rather be gray and recording the MOB alert for later,
        // if possible with phone-local GPS coords
        $('#btnmob').addClass('hidden');
        $('#btnchat').addClass('hidden');
    }

    send(msg) {
        var json = JSON.stringify(msg)
        console.log('Transmitting msg: ', json);
        this.sock.send(json);
    }

    listen(topic, handler) {

        if (_.has(this.handlers, topic)) {
            this.handlers[topic].push(handler);
            console.log('New handler registered for topic ', topic);
        } else {
            this.handlers[topic] = [handler];
            console.log('First handler registered for topic ', topic);
        }

        console.log(this.handlers);
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

SocketService.$inject = ['$location', '$alert', '$timeout', '$rootScope'];

export default SocketService;

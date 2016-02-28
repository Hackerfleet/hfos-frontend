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

import * as _ from 'lodash';

let handlers = {'profile': []};
let stats = {
    rx: 0,
    tx: 0,
    start: 0,
    lag: 0
};

let connected = true;
let stayonline = true;
let trying = false;
let reconnecttries = 0;
let disconnectalert = '';

function hideElements() {
    $('#btnuser').addClass('hidden');
    // TODO: Mob button should rather be gray and recording the MOB alert for later,
    // if possible with phone-local GPS coords
    $('#btnmob').addClass('hidden');
    $('#btnchat').addClass('hidden');
}

function finallyClosed() {
    console.log('[SOCKET] Something closed the websocket!');
    connected = false;
    $('#btnhome').css('color', 'red');

    hideElements();
}


class SocketService {

    constructor($location, $websocket, $alert) {
        console.log('SocketService constructing');
        this.$alert = $alert;
        var host = $location.host();
        var port = 8055;

        this.sock = $websocket('ws://' + host + ':' + port + '/websocket');

        this.handlers = handlers;
        this.connected = connected;

        this.sock.onOpen(this.OpenEvent);
        this.sock.onClose(this.CloseEvent);

        function receive(packedmsg) {
            console.log('Raw message received: ', packedmsg);
            var msg = JSON.parse(packedmsg.data);

            console.log('Parsed message: ', msg, handlers);

            if (_.has(msg, 'component')) {
                if (_.has(msg, 'action')) {
                    console.log('Correct message received. Handlers: ', handlers, msg.component);
                    if (_.has(handlers, msg.component)) {
                        console.log('Found a matching handler.');
                        _.forIn(handlers[msg.compoennt], function (value, key) {
                            console.log('Executing handler: ', value, key, msg);
                            key(msg);
                        });
                    }
                } else {
                    console.log('Incorrect message: no action!');
                }
            } else {
                console.log('Incorrect message: component!');
            }
        }

        this.sock.onMessage(receive);

    }

    send(msg) {
        console.log('Transmitting msg: ', msg);
        this.sock.send(msg);
    }


    listen(topic, handler) {

        if (_.has(handlers, topic)) {
            handlers[topic].push(handler);
            console.log('New handler registered for topic ', topic);
        } else {
            handlers[topic] = [handler];
            console.log('First handler registered for topic ', topic);
        }

        console.log(handlers);
    }

    OpenEvent() {
        console.log('[SOCKET] Websocket successfully opened!');
        connected = true;
        stayonline = true;
        trying = false;
        reconnecttries = 0;

        /*if (disconnectalert !== '') {
         disconnectalert.hide();
         }*/

        var currentdate = new Date();
        document.getElementById('btnhome').title = 'Connected since ' + currentdate;
        stats.start = currentdate;

        /*disconnectalert = this.$alert({
         'title': 'Online',
         'content': 'The connection to the node has been established. You\'re online!',
         'placement': 'top-left',
         'type': 'info',
         'show': true,
         'duration': 5
         });*/

        $('#btnhome').css('color', '#3a75a8');
        $('#btnuser').removeClass('hidden').css('color', '');
    }

    CloseEvent() {
        console.log('[SOCKET] Close event called.');

        connected = false;

        var currentdate = new Date();

        document.getElementById('btnhome').title = 'Disconnected since ' + currentdate;
        //$('#btnhome').prop('title', 'Disconnected since ' + currentdate);

        hideElements();
        if (trying === true) {
            console.log('[SOCKET] Already trying');
            return;
        }
        if (this.stayonline === true) {
            this.doReconnect();
        } else {
            finallyClosed();
        }
    }

    isConnected() {
        return connected;
    }

    doDisconnect() {
        stayonline = false;
        this.sock.close();
        //hideElements();
    }

    check() {
        console.log('[SOCKET] Connection state: ', connected);

        if (this.connected) {
            console.log('[SOCKET] All nice, we are still connected');
        } else {
            console.log('[SOCKET] Reconnecting...');
            this.sock.reconnect();
        }
    }
}

SocketService.$inject = ['$location', '$websocket', '$alert'];

export default SocketService;

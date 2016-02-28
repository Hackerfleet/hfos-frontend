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
 * Created by riot on 23.02.16.
 */

let signedin = false;
let signingIn = false;
let onAuthCallbacks = [];
let user = '';

/*
 class UserService {
 constructor(socket) {
 this.foobar = "FOO";
 this.msgs = [];
 this.socket = socket;
 this.socket.onMessage(this.socketread); // Works the function is called by the socket
 }

 getFoo() {
 // Calling this.getFoo() here, in the UserService returns FOO, but calling it from another controller that
 // had the Userservice injected makes the inside 'this' vanish.
 return this.foobar;
 }

 socketread(msg) {
 this.msgs.push(msg);  // << 'this' again is unknown when the handler is called from the socket
 }
 }*/

class UserService {

    /*@ngInject*/
    constructor($cookies, $md5, socket, alert, modal, $rootScope, $location, $interval) {
        console.log('UserService constructing');
        this.cookies = $cookies;
        this.md5 = $md5;
        this.socket = socket;
        console.log(this.socket);
        console.log(this.socket.connected);
        this.alert = alert;
        this.modal = modal;
        //this.$route = $route;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$interval = $interval;

        this.signedin = false;
        this.signingIn = false;

        console.log('UserService constructed');


        this.socket.listen('auth', this.loginaction);
        this.foobar();
        /*
         this.socket.onMessage(function (message) {
         // Authorization Handler
         var msg = JSON.parse(message.data);

         if (msg.component === 'auth') {
         console.log('[USER] Got an auth packet!');

         if (msg.action === 'login') {
         console.log('[USER] Authenticated successfully!');
         user = msg.data;
         this.signIn();
         } else if (msg.action === 'new') {
         console.log('[USER] Aaah, a fresh one. Displaying welcome.');
         this.$alert({
         'title': 'Registration successful',
         'type': 'success',
         'content': '<br />Welcome to HFOS! Your account has been successfully created.<br />' +
         'Click this button again to edit your profile or logout.',
         'show': true,
         'placement': 'top-left',
         'duration': 30
         });
         }
         } else if (msg.component === 'profile') {
         console.log('[USER] Profile received.');
         this.profile = msg.data;
         $('#btnuser').css('color', '#0f0');
         $('#btnchat').removeClass('hidden');
         console.log('[USER] Profile: ', profile);
         this.changeCurrentTheme(this.profile.settings.theme);

         $rootScope.$broadcast('Profile.Update');
         } else if (msg.component === 'clientconfig') {
         console.log('[USER] Client configuration received.');
         this.clientconfig = msg.data;
         console.log('[USER] Client config: ', clientconfig);
         this.storeUUID(clientconfig.uuid);

         $('#clientname').html('<a href="#/obj/client/' + this.clientconfig.uuid + '">' + this.clientconfig.name + '</a>');

         this.$rootScope.$broadcast('Clientconfig.Update');
         }
         });
         */

    }

    signIn() {
        signedin = true;
        signingIn = false;

        for (var i = 0; i < onAuthCallbacks.length; i++) {
            onAuthCallbacks[i].call(user);
        }

        $('#btnuser').css('color', '#ff0');
        $('#nav-dashboard, #nav-logbook, #nav-settings').removeClass('hidden');
        //$('#nav-crew', '#nav-switchboard').removeClass('hidden');


        this.$rootScope.$broadcast('User.Login');

        if (this.desiredcontext !== false) {
            console.log('[USER] Reloading to page ', this.desiredcontext);
            this.$location.url(this.desiredcontext);
            this.$rootScope.apply();
        }
        //this.$route.reload();
        //var usvc = this;
    }

    loginaction(msg) {
        console.log('Login Action triggered: ', msg);
    }

    login(username, password) {
        console.log('[USER] Service Login triggered');
        if (signedin === true) {
            console.log('[USER] Already logged in. Showing Profile.');
            this.showprofile();
        } else {
            if (typeof(username) === 'undefined') {
                console.log('[USER] No username given, showing login dialog.');
                this.showlogin();
            } else {
                this.dologin(username, password);
            }
        }
    }

    getUUID() {
        var uuid = this.cookies.get('hfosclientuuid');
        if (typeof uuid === 'undefined') {
            uuid = '';
        }
        return uuid;
    }

    dologin(username, password) {
        console.log(this.socket);
        if (this.socket.connected === true) {
            console.log('[USER] Trying to login.');
            var uuid = this.getUUID();
            console.log('[USER] Client UUID: ', uuid);

            var authpacket = {
                'component': 'auth', 'action': 'login',
                'data': {
                    'username': username,
                    'password': this.md5.createHash(password || ''),
                    'clientuuid': uuid
                }
            };

            this.socket.send(authpacket);
        } else {
            console.log('[USER] Not connected, cannot login.');
        }
    }

    foobar() {
        console.log('HALLLLLLLLLLLLLLLOOOOOOOO');
        console.log(this.socket);
        console.log(this.socket.connected);
        this.dologin();
    }

}

//($cookies, $md5, socket, alert, modal, $rootScope, $location, $route, $interval) {
UserService.$inject = ['$cookies', 'md5', 'socket', '$alert', '$modal', '$rootScope', '$location', '$interval'];

export default UserService;

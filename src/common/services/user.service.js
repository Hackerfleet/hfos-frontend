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
'use strict';


import loginmodal from '../modals/login.tpl.html';
import useractionmodal from '../modals/user.tpl.html';
import logincontroller from '../component/login-component';

class UserService {

    /*@ngInject*/
    constructor($cookies, $md5, $socket, alert, $modal, $rootScope, $location, $state, $timeout) {
        console.log('UserService constructing');
        this.cookies = $cookies;
        this.md5 = $md5;
        this.socket = $socket;
        this.alert = alert;
        this.modal = $modal;
        this.rootscope = $rootScope;
        this.location = $location;
        this.state = $state;
        this.timeout = $timeout;

        this.signedin = false;
        this.signingIn = false;

        this.onAuthCallbacks = [];

        this.username = '';
        this.useruuid = '';

        this.desiredcontext = '';

        this.user = {};
        this.profile = {};
        this.clientconfig = {};
        this.clientuuid = '';
        this.clientconfiglist = {};

        var self = this;

        function loginaction(msg) {
            console.log('Login Action triggered: ', msg);
            self.username = msg.data.name;
            self.useruuid = msg.data.uuid;
            self.signIn();
        }

        function storeclientconfigcookie(msg) {
            console.log('Got a clientconfig: ', msg.data);
            self.clientconfig = msg.data;

            console.log('[USER] Client config: ', self.clientconfig);
            self.storeCookie(self.clientconfig.uuid, self.clientconfig.autologin);

            $('#clientname').html('<a href="#/editor/client/' + self.clientconfig.uuid + '/edit">' + self.clientconfig.name + '</a>');

            self.rootscope.$broadcast('Clientconfig.Update');

        }

        self.storerclientconfigcookie = storeclientconfigcookie;

        function storeprofile(msg) {
            console.log('Got profile data: ', msg.data);
            self.profile = msg.data;

            $('#btnuser').css('color', '#0f0');
            //$('#btnchat').removeClass('hidden');
            console.log('[USER] Profile: ', self.profile, self);

            self.changeCurrentTheme();
            console.log('[USER] Emitting update');

            self.rootscope.$broadcast('Profile.Update');
        }

        self.storeprofile = storeprofile;

        function greetnewuser(msg) {
            console.log('[USER] Aaah, a fresh one. Displaying welcome.');
            self.$alert({
                'title': 'Registration successful',
                'type': 'success',
                'content': '<br />Welcome to HFOS! Your account has been successfully created.<br />' +
                'Click this button again to edit your profile or logout.',
                'show': true,
                'placement': 'top-left',
                'duration': 30
            });
        }

        function checkautologin() {
            var cookie = self.getCookie();
            if (cookie.autologin) {
                self.cookielogin(cookie.uuid);
            }
        }

        function updateclientconfig(ev, uuid, newobj) {
            console.log('[USER] New object!', ev, uuid, newobj, self.clientuuid);
            if (String(uuid) == String(self.clientuuid)) {
                console.log('[USER] Got selected config from OP:', newobj);
                var msg = {data: newobj};
                self.storerclientconfigcookie(msg); // TODO: Ugly, hacky.
            } else if (String(uuid) == String(self.profile.uuid)) {
                console.log('[USER] Got a profile update from OP:', newobj);
                var msg = {data: newobj};
                self.storeprofile(msg);
            }
        }

        this.socket.listen('auth', loginaction);
        this.socket.listen('profile', storeprofile);
        this.socket.listen('new', greetnewuser);
        this.socket.listen('clientconfig', storeclientconfigcookie);

        this.rootscope.$on('Client.Connect', checkautologin);
        this.rootscope.$on('OP.Get', updateclientconfig);
        this.rootscope.$on('OP.Update', updateclientconfig);

        console.log('UserService constructed');

    }

    logout(force) {
        if (this.socket.connected === true || force === true) {
            console.log('[USER] Trying to logout.');
            var authpacket = {component: 'auth', action: 'logout'};
            this.socket.send(authpacket);

            this.profile = {};
            this.clientconfig = {};
            this.user = {};
            this.signedin = false;
            $('#btnuser').css('color', '');
            $('#btnchat').addClass('hidden');
            $('#btnmob').addClass('hidden');
            //$location.url('');
            //$route.reload();
        } else {
            console.log('[USER] Cannot logout - not connected.');
        }
    }


    onAuth(callback) {
        if (typeof callback !== 'function') {
            throw new Error('[USER] Callback must be a function');
        }

        this.onAuthCallbacks.push(callback);
    }

    login(username, password) {
        console.log('[USER] Service Login triggered');
        if (this.signedin === true) {
            console.log('[USER] Already logged in. Showing Profile.');
            this.showuseractions();
        } else {
            if (typeof(username) === 'undefined') {
                console.log('[USER] No username given, showing login dialog.');

                this.showlogin();
            } else {
                this.dologin(username, password);
            }
        }
    }

    dologin(username, password) {
        console.log(this.socket);
        if (this.socket.connected === true) {
            console.log('[USER] Trying to login.');
            var cookie = this.getCookie();
            var uuid = cookie.uuid;
            console.log('[USER] Client cookie: ', cookie);

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


    signIn() {
        this.signedin = true;
        this.signingIn = false;

        for (var i = 0; i < this.onAuthCallbacks.length; i++) {
            this.onAuthCallbacks[i].call(this.username);
        }

        $('#btnuser').css('color', '#ff0');
        //$('#nav-dashboard, #nav-logbook, #nav-settings').removeClass('hidden');
        //$('#nav-crew', '#nav-switchboard').removeClass('hidden');

        this.rootscope.$broadcast('User.Login');

        if (this.desiredcontext !== false) {
            console.log('[USER] Reloading to page ', this.desiredcontext);
            // TODO: Make this work again, with states etc
            //location.url(desiredcontext);
            //rootscope.apply();
        }
        //this.$route.reload();

    }

    showprofile() {
        this.state.go('app.editor', {schema: 'profile', action: 'edit', 'uuid': this.useruuid});
    }

    showlogin() {
        if (this.signingIn !== true) {

            this.modal({
                template: loginmodal,
                controller: logincontroller,
                controllerAs: '$ctrl',
                title: 'Login to HFOS',
                keyboard: false,
                id: 'loginDialog'
            });

            this.signingIn = true;
        }
    }

    showuseractions() {
        if (this.signingIn !== true) {

            this.modal({
                template: useractionmodal,
                controller: logincontroller,
                controllerAs: '$ctrl',
                title: 'User actions',
                id: 'useractionDialog'
            });
        }
    }

    cookielogin(uuid) {
        console.log('Auto-logging in...');
        var authpacket = {component: 'auth', action: 'autologin', data: uuid};
        var self = this;
        this.timeout(function () {
            console.log('Transmitting autologin.')
            self.socket.send(authpacket);
        }, 500);
    }

    storeCookie(newuuid, autologin) {
        console.log('[USER] Storing configuration UUID cookie:', newuuid, autologin);
        this.clientuuid = newuuid;
        this.cookies.put('hfosclient', JSON.stringify({uuid: newuuid, autologin: autologin}));
    }

    getCookie() {
        var cookie = this.cookies.get('hfosclient');

        if (typeof cookie === 'undefined') {
            cookie = "";
        } else {
            cookie = JSON.parse(cookie);
        }

        return cookie;
    }

    changeCurrentTheme(newTheme) {
        // TODO: Better check for unset theme or better unsetting
        console.log('[USER] Setting new theme');
        if ((typeof newTheme !== 'undefined') && (newTheme.length > 5)) {
            console.log('[USER] Switching to theme ', newTheme);
            $('#BootstrapTheme').attr('href', 'bower_components/' + newTheme + 'bootstrap-theme.css');
            $('#Bootstrap').attr('href', 'bower_components/' + newTheme + 'bootstrap.css');
        } else {
            console.log('[USER] Not switching to undefined theme.');
        }
    }

    logincancel() {
        console.log('Login cancelled');
        this.signingIn = false;
    }

    saveClientconfig() {
        console.log('[USER] Storing client profile on node');
        this.socket.send({
            'component': 'objectmanager',
            'action': 'put',
            'data': {'schema': 'client', 'obj': this.clientconfig}
        });
    };

    switchClientconfig(uuid) {
        console.log('[USER] Loading client profile from node');
        this.clientuuid = uuid;
        this.socket.send({
            'component': 'objectmanager',
            'action': 'get',
            'data': {'schema': 'client', 'uuid': this.clientuuid}
        });
    };

    updateclientconfig(data) {
        this.clientconfig = data;
        // TODO: Validate with schema from newly built schemaservice
        console.log('[USER] Updating client configuration with ', this.clientconfig);
        this.saveClientconfig();

        this.rootscope.$broadcast('Clientconfig.Update');
    };

}

//($cookies, $md5, socket, alert, modal, $rootScope, $location, $route, $interval) {
UserService.$inject = ['$cookies', 'md5', 'socket', '$alert', '$modal', '$rootScope', '$location', '$state', '$timeout'];

export default UserService;

'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.user
 * @description
 * # user
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('user', function ($cookies, $rootScope, $route, $location, $alert, socket, md5, createDialog) {
        // AngularJS will instantiate a singleton by calling 'new' on this function

        var user = {};
        var profile = {};
        var clientconfig = {};

        var signedin = false;
        var onAuthCallbacks = [];

        var signIn = function () {
            signedin = true;

            for (var i = 0; i < onAuthCallbacks.length; i++) {
                onAuthCallbacks[i].call(user);
            }

            $('#btnuser').css('color', '#ff0');


            $rootScope.$broadcast('User.Login');

            //$route.reload();
        };

        var changeCurrentTheme = function (newTheme) {
            if (typeof newTheme !== 'undefined') {
                console.log('[USER] Switching to theme ', newTheme);
                $('#BootstrapTheme').attr('href', 'bower_components/' + newTheme + 'bootstrap-theme.css');
                $('#Bootstrap').attr('href', 'bower_components/' + newTheme + 'bootstrap.css');
            } else {
                console.log('[USER] Not switching to undefined theme.');
            }
        };

        function storeUUID(clientuuid) {
            console.log('[USER] Storing configuration UUID cookie: ', clientuuid);
            $cookies.put('hfosclientuuid', clientuuid);
        }

        function getUUID() {
            var uuid = $cookies.get('hfosclientuuid');
            if (typeof uuid === 'undefined') {
                uuid = '';
            }
            return uuid;
        }

        socket.onClose(function () {
            // Logout Handler
            signedin = false;
            // TODO: Close chat etc, move this there, use hook
            $('#btnchat').addClass('hidden');
        });

        socket.onMessage(function (message) {
            // Authorization Handler
            var msg = JSON.parse(message.data);

            if (msg.component === 'auth') {
                console.log('[USER] Got an auth packet!');

                if (msg.action === 'login') {
                    console.log('[USER] Authenticated successfully!');
                    user = msg.data;
                    signIn();
                } else if (msg.action === 'new') {
                    console.log('[USER] Aaah, a fresh one. Displaying welcome.');
                    $alert({
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
                profile = msg.data;
                $('#btnuser').css('color', '#0f0');
                $('#btnchat').removeClass('hidden');
                changeCurrentTheme(profile.theme);

                $rootScope.$broadcast('Profile.Update');
            } else if (msg.component === 'clientconfig') {
                console.log('[USER] Client configuration received.');
                clientconfig = msg.data;
                console.log('[USER] Client config: ', clientconfig);
                storeUUID(clientconfig.uuid);

                $rootScope.$broadcast('Clientconfig.Update');
            }
        });

        var updateclientconfig = function (data) {
            clientconfig = data;
            // TODO: Validate with schema from newly built schemaservice
            console.log('[USER] Updating client configuration with ', clientconfig);
            socket.send({'component': 'clientconfig', 'action': 'update', 'data': clientconfig});

            $rootScope.$broadcast('Clientconfig.Update');
        };

        var updateprofile = function (data) {
            profile = data;
            // TODO: Validate with schema from newly built schemaservice
            console.log('[USER] Updating profile with ', profile);
            socket.send({'component': 'profile', 'action': 'update', 'data': profile});


            $rootScope.$broadcast('Profile.Update');
        };

        var isSignedin = function () {
            console.log('[USER] Sign in status requested!');
            return signedin;
        };

        var getuser = function () {
            console.log('[USER] User data requested!');
            return user;
        };

        var getprofile = function () {
            console.log('[USER] Profile data requested!');
            return profile;
        };

        var getclientconfig = function () {
            console.log('[USER] Client configuration requested!');
            return clientconfig;
        };

        var showlogin = function () {
            createDialog('/views/modals/login.tpl.html', {
                    id: 'loginDialog',
                    title: 'Login to HFOS',
                    backdrop: false,
                    footerTemplate: '<span></span>'
                }
            );
        };

        var showprofile = function () {
            console.log('[USER] Showing profile.');

            createDialog('/views/modals/user.tpl.html', {
                    id: 'UserDialog',
                    title: 'User settings',
                    backdrop: false,
                    footerTemplate: '<span></span>'
                }
            );
        };

        var dologin = function (username, password) {
            if (socket.connected) {
                console.log('[USER] Trying to login.');
                var uuid = getUUID();
                console.log('[USER] Client UUID: ', uuid);

                var authpacket = {
                    'component': 'auth', 'action': 'login',
                    'data': {
                        'username': username,
                        'password': md5.createHash(password || ''),
                        'clientuuid': uuid
                    }
                };

                socket.send(authpacket);
            } else {
                console.log('[USER] Not connected, cannot login.');
            }
        };

        var logout = function (force) {
            if (socket.connected() === true || force === true) {
                console.log('[USER] Trying to logout.');
                var authpacket = {'component': 'auth', 'action': 'logout'};
                socket.send(authpacket);

                user = {};
                signedin = false;
                $('#btnuser').css('color', '');
                $('#btnchat').addClass('hidden');
                $('#btnmob').addClass('hidden');
                $location.url('');
                $route.reload();
            } else {
                console.log('[USER] Cannot logout - not connected.');
            }
        };

        var login = function (username, password) {
            console.log('[USER] Service Login triggered');
            if (isSignedin() === true) {
                console.log('[USER] Already logged in. Showing Profile.');
                showprofile();
            } else {
                if (typeof(username) === 'undefined') {
                    console.log('[USER] No username given, showing login dialog.');
                    showlogin();
                } else {
                    dologin(username, password);
                }
            }
        };

        var check = function () {
            console.log('[USER] Signed in: ', signedin);
            console.log('[USER] User: ', user);
            console.log('[USER] Profile: ', profile);
            console.log('[USER] Client configuration: ', clientconfig);
        };

        return {
            login: login,
            logout: logout,
            check: check,

            signedin: isSignedin,

            user: getuser,

            profile: getprofile,
            updateprofile: updateprofile,

            clientconfig: getclientconfig,
            updateclientconfig: updateclientconfig,

            onAuth: function (callback) {
                if (typeof callback !== 'function') {
                    throw new Error('[USER] Callback must be a function');
                }

                onAuthCallbacks.push(callback);
            }
        };
    }).controller('UserCtrl', function ($scope, $location, user) {
        console.log('[USER] UserCtrl loaded!');
        console.log(user.user());
        $scope.user = user.user();
        $scope.logout = user.logout;
        $scope.editprofile = function () {
            console.log('[USER] Loading profile page.');
            $location.url('profile');
        };
        $('#usercancel').focus();
    });

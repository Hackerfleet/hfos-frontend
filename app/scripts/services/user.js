'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.user
 * @description
 * # user
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
  .service('user', function ($rootScope, $route, $location, socket, md5, createDialog) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var user = {};
    var profile = {};

    var signedin = false;
    var onAuthCallbacks = [];

    var signIn = function() {
        signedin = true;
    }

    socket.onClose(function() {
        signedin = false;
        // TODO: Close chat etc, move this there, use hook
        $("#btnchat").addClass("hidden");
    });


    socket.onMessage(function(message) {
        var data = JSON.parse(message.data);

        if (data.type === 'auth') {
            console.log('Got an auth packet!');
            var auth = data.content;
            console.log(auth);

            if(auth.success) {
                console.log('Authenticated successfully!');

                for (var i = 0; i < onAuthCallbacks.length; i++) {
                    onAuthCallbacks[i].call(auth);
                }

                console.log('Setting signedin status.');
                $("#btnuser").css("color", "#ff0");

                user = auth.useraccount;
                signIn();
            }
        } else if (data.type === 'profile') {
            console.log('Profile received.')
            profile = data.content
            $("#btnuser").css("color", "#0f0");
            $("#btnchat").removeClass("hidden")
            $rootScope.$broadcast('profileupdate');
        }
    });

    var updateprofile = function (data) {
        profile.data = data
        console.log('Updating profile with ', profile.data);
        socket.send({'type': 'profile', 'content': profile.data});
        $rootScope.$broadcast('profileupdate');
    }

    var isSignedin = function() {
        console.log('Sign in status requested!');
        console.log(user);
        return signedin;
    }

    var getuser = function() {
        console.log('User data requested!');
        return user.data;
    }

    var getprofile = function() {
        console.log('Profile data requested!');
        return profile;
    }

    var showlogin = function() {
        createDialog('/views/modals/login.tpl.html', {
                id: 'loginDialog',
                title: 'Login to HFOS',
                footerTemplate: '<span></span>',
            }
        );
    }

    var showprofile = function() {
        console.log('Showing profile.');

        createDialog('/views/modals/profile.tpl.html', {
                id: 'profileDialog',
                title: 'Userprofile',
                footerTemplate: '<span></span>',
            }
        );
    }

    var dologin = function(username, password) {
        if (socket.connected) {
            console.log('Trying to login.');

            var authpacket = {'type': 'auth', 'content': {
                'username': username,
                'password': md5.createHash(password || ''),
                }
            };

            socket.send(authpacket);
        } else {
            console.log('Not connected, cannot login.');
        }
    }

    var logout = function(force) {
        if (socket.connected) {
            console.log('Trying to logout.');
            var authpacket = {'type': 'auth', 'content': 'logout'};
            socket.send(authpacket);

            user = {};
            signedin = false;
            $('#btnuser').css('color', '');
            $("#btnchat").addClass("hidden")
            $location.url("");
            $route.reload();
        } else {
            console.log('Cannot logout - not connected.');
        }
    }

    var login = function(username, password) {
        console.log('Service Login triggered');
        if (isSignedin() === true) {
            console.log('Already logged in. Showing Profile.');
            showprofile();
        } else {
            if (typeof(username) === 'undefined') {
                console.log('No username given, showing login dialog.');
                showlogin();
            } else {
                dologin(username, password);
            }
        }
    }

    var check = function() {
        console.log('Signed in: ', signedin);
        console.log('User: ', user);
        console.log('Profile:', profile);
    }

    return {
        login: login,
        logout: logout,
        check: check,

        signedin: isSignedin,

        user: getuser,
        profile: getprofile,

        updateprofile: updateprofile,

        onAuth: function (callback) {
            if (typeof callback !== 'function') {
              throw new Error('Callback must be a function');
            }

            onAuthCallbacks.push(callback);
          }
        };
  });

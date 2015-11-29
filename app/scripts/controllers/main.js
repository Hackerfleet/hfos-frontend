'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('MainCtrl', function ($scope, $route, $aside, Alert, schemata, socket, user) {

        console.log('[MAIN] Controller started');

        var chatAside = $aside({
            scope: $scope,
            template: 'views/aside/chat.tpl.html',
            show: false,
            backdrop: false
        });

        $scope.isChatOpen = false;
        $scope.signedin = false;

        // TODO: Move this to the client configuration as server supplied module list or something
        $scope.items = [
            {
                title: 'Map',
                url: 'map',
                svg: 'iconmonstr-map-2-icon.svg',
                row: 0,
                col: 0
            },
            {
                title: 'Switchboard',
                url: 'switchboard',
                svg: 'iconmonstr-control-panel-icon.svg',
                row: 0,
                col: 1
            },
            {
                title: 'Communication',
                url: 'communication',
                svg: 'iconmonstr-radio-tower-icon.svg',
                row: 0,
                col: 2
            },
            {
                title: 'Wiki',
                url: 'wiki/Index',
                svg: 'iconmonstr-note-21-icon.svg',
                row: 0,
                col: 3
            },
            {
                title: 'Weather',
                url: 'weather',
                svg: 'iconmonstrandhackerfleet-weather-icon.svg',
                row: 1,
                col: 0
            },
            {
                title: 'Logbook',
                url: 'logbook',
                svg: 'iconmonstr-printer-icon.svg',
                row: 1,
                col: 1
            },
            {
                title: 'Dashboard',
                url: 'dashboard',
                svg: 'iconmonstr-compass-6-icon.svg',
                row: 1,
                col: 2
            },
            {
                title: 'Settings',
                url: 'settings',
                svg: 'iconmonstr-wrench-4-icon.svg',
                row: 1,
                col: 3
            }, {
                title: 'Remote Control',
                url: 'gamepadremote',
                svg: 'iconmonstr-gamepad-2-icon.svg',
                row: 2,
                col: 0
            }, {
                title: 'Library',
                url: 'library',
                svg: 'iconmonstr-mediamashup-icon.svg',
                row: 2,
                col: 1
            }, {
                title: 'Tasks',
                url: 'tasks',
                svg: 'iconmonstr-clipboard-4-icon.svg',
                row: 2,
                col: 2

            }
        ];


        $scope.gridsterOptions = {
            // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
            columns: screen.width / 150,
            rowHeight: 150,
            colWidth: 150,

            margins: [5, 5]
        };

        socket.send({'type': 'info', 'content': 'Main Controller activated'});

        $('#bootscreen').hide();

        $scope.home = function (event) {
            if (event.shiftKey === true) {
                console.log('[MAIN] Reloading route.');
                $route.reload();
            } else if (event.ctrlKey === true) {
                console.log('[MAIN] Disconnecting');
                socket.disconnect();
            }
            socket.check();
            user.check();
            schemata.check();
            console.log('[MAIN] Main profile: ', user.profile());
        };

        $scope.userbutton = function (event) {
            console.log('[MAIN] USERBUTTON: ', event);
            user.login();
            //user.onAuth(loginModal.hide);
        };

        $scope.mobbutton = function () {
            console.log('[MAIN] MOB Button pressed');
            Alert.mobTrigger();
        };


        $scope.chattoggle = function () {
            if ($scope.isChatOpen) {
                $scope.chatclose();
            } else {
                $scope.chatopen();
            }
        };

        $scope.chatclose = function () {
            console.log('[MAIN] Closing down chat.');
            chatAside.hide();
            $('#btnchat').css('color', '');
            $scope.isChatOpen = false;
        };

        $scope.chatopen = function () {
            console.log('[MAIN] Trying to open chat.');
            if (user.signedin()) {
                console.log('[MAIN] Opening chat.');
                chatAside.$promise.then(chatAside.show());

                $('#btnchat').css('color', '#0f0');
                $scope.isChatOpen = true;
                $('#chatinput').focus();
            }
        };
        console.log(user.signedin());

        $scope.$on('User.Login', function () {
            console.log('[MAIN] Logged in - updating menu');
            $scope.signedin = true;
        });

    });

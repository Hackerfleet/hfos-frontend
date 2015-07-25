'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('MainCtrl', function ($scope, $route, $modal, $aside, $interval, schemata, socket, user) {

        var chatAside = $aside({scope: $scope, template: 'views/aside/chat.tpl.html', show: false, backdrop: false});

        $scope.isChatOpen = false;

        socket.send({'type': 'info', 'content': 'Main Controller activated'});

        $('#bootscreen').hide();

        $scope.home = function (event) {
            if (event.shiftKey === true) {
                console.log('Reloading route.');
                $route.reload();
            } else if (event.ctrlKey === true) {
                console.log('Disconnecting');
                socket.disconnect();
            }
            socket.check();
            user.check();
            schemata.check();
            console.log('Main profile: ', user.profile());
        };

        $scope.userbutton = function (event) {
            console.log('USERBUTTON: ', event);
            user.login();
            //user.onAuth(loginModal.hide);
        };

        $scope.chattoggle = function () {
            if ($scope.isChatOpen) {
                $scope.chatclose();
            } else {
                $scope.chatopen();
            }
        };

        $scope.chatclose = function () {
            console.log('Closing down chat.');
            chatAside.hide();
            $('#btnchat').css('color', '');
            $scope.isChatOpen = false;
        };

        $scope.chatopen = function () {
            console.log('Trying to open chat.');
            if (user.signedin()) {
                console.log('Opening chat.');
                chatAside.$promise.then(chatAside.show());

                $('#btnchat').css('color', '#0f0');
                $scope.isChatOpen = true;
                $('#chatinput').focus();
            }
        };


    });

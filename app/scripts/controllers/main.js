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

    socket.send({'type': 'info', 'content':'Main Controller activated'});
    $('#bootscreen').hide();
    var chatAside = $aside({scope: $scope, template: 'views/aside/chat.tpl.html', show:false, backdrop: false});
    var blinkstate = 0;
    var blinker = false;

    $scope.chat = { messages: [],
                    input: '',
                    open: false,
    };

    socket.onMessage(function(message) {
        // Main and Chat Handler
        var msg = JSON.parse(message.data);

        console.log(msg);

        if(msg.component === 'warning') {
          var warningmodal = $modal({title: 'Warning!', content: String(msg.data), show:true});
        } else if(msg.component === 'chat') {
            console.log('Incoming chat data: ', msg);
            $scope.chat.messages.push(msg.data);
            console.log($scope.chat);
            //if($scope.chat.open === false) {
                blinkstate = 1;
                blinker = $interval(blinkfunc, 1500, 5);
            //}
        }
    });

    var blinkfunc = function() {
        console.log('Blinkstate:', blinkstate);
        if(blinkstate === 0) {
            if($scope.chat.open === true) {
                $('#btnchat').css('color', '#0f0');
            } else {
                $('#btnchat').css('color', '');
            }
            return;
        } else if(blinkstate === 1) {
            $('#btnchat').css('color', '#ff0');
            blinkstate++;
        } else if(blinkstate === 2) {
            $('#btnchat').css('color', '');
            blinkstate = 1;
        }
    };

    $scope.home = function(event) {
        if (event.shiftKey === true) {
            console.log('Reloading route.');
            $route.reload();
        } else if (event.ctrlKey === true) {
            console.log('Disconnecting');
            socket.disconnect();
        }
        socket.check();
        user.check();
        console.log('Main profile: ', user.profile());
    };

    $scope.userbutton = function(event) {
        console.log('USERBUTTON: ', event);
        user.login();
        //user.onAuth(loginModal.hide);
    };

    $scope.chattoggle = function() {
        if ($scope.chat.open) {
            $scope.chatclose();
        } else {
            $scope.chatopen();
        }
    };

    $scope.chatclose= function() {
        console.log('Closing down chat.');
        chatAside.hide();
        $('#btnchat').css('color', '');
        $scope.chat.open = false;
    };

    $scope.chatopen = function() {
        console.log('Trying to open chat.');
        if (user.signedin()) {
            console.log('Opening chat.');
            chatAside.$promise.then(chatAside.show());

            $('#btnchat').css('color', '#0f0');
            $scope.chat.open = true;
            $('#chatinput').focus();
        }
    };

    $scope.chatsend = function() {
        console.log('Transmitting current message.');
        socket.send({'component': 'chat', 'action': 'say', 'data': $scope.chat.input});
        $scope.chat.input = '';
    };

  });

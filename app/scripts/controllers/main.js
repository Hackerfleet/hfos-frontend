'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
  .controller('MainCtrl', function ($scope, $route, $modal, $aside, $interval, socket, user) {

    socket.send({'type': 'info', 'content':'Main Controller activated'});

    var chatAside = $aside({scope: $scope, template: 'views/aside/chat.tpl.html', show:false, backdrop: false});
    var blinkstate = 0
    var blinker = false;

    $scope.chat = { messages: [],
                    input: '',
                    open: false,
    };

    socket.onMessage(function(message) {
        var data = JSON.parse(message.data);

        console.log(data);

        if(data.type === 'warning') {
          var warningmodal = $modal({title: 'Warning!', content: String(data.content), show:true});
        } else if(data.type === 'chat') {
            console.log('Incoming chat data: ', data);
            $scope.chat.messages.push(data.content);
            console.log($scope.chat);
            if($scope.chat.open === false) {
                blinkstate = 1;
                blinker = $interval(blinkfunc, 500, 5);
            }
        }
    });

    var blinkfunc = function() {
        if(blinkstate === 0) {
            if($scope.chat.open === true) {
                $('#chatbtn').css('color', '#0f0');
            } else {
                $('#chatbtn').css('color', '');
            }
            return;
        } else if(blinkstate === 1) {
            $('#chatbtn').css('color', '#ff0');
            blinkstate++;
        } else if(blinkstate === 2) {
            $('#chatbtn').css('color', '');
            blinkstate = 1;
        };
    }

    $scope.home = function(event) {
        if (event.shiftKey === true) {
            console.log('Reloading route.');
            $route.reload();
        }
        socket.check();
        user.check();
        console.log("Main profile: ", user.profile);
    }

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

        $('#chatbtn').css("color", "");
        $scope.chat.open = false;
    };

    $scope.chatopen = function() {
        console.log('Trying to open chat.');
        if (user.signedin()) {
            console.log('Opening chat.');
            chatAside.$promise.then(chatAside.show());

            $('#chatbtn').css("color", "#0f0");
            $scope.chat.open = true;
        }
    };

    $scope.chatsend = function() {
        console.log('Transmitting current message.');
        socket.send({'type': 'chatrequest', 'content': {'type': 'msg', 'content': $scope.chat.input}});
        $scope.chat.input = '';
    };

  });

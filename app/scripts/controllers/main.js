'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $modal, $aside, socket, md5) {
    //var ws = ngSocket('ws://localhost:8055/websocket');

    //ws.send({Hello: 'bar'});

    var loginModal = $modal({scope: $scope, template: 'views/modals/login.tpl.html', show: false});
    var profileModal = $modal({scope: $scope, template: 'views/modals/profile.tpl.html', show: false});

    var chatAside = $aside({scope: $scope, template: 'views/aside/chat.tpl.html', show:false});

    $scope.user = { username: '',
                    password: '',
                    profile: {},
                    uid: false,
                    uuid: false,
    };

    $scope.status = { connected: false,
                      signedin: false
    };

    $scope.chat = { messages: [],
                    input: "",
                    open: false,
    };

    $scope.chattoggle = function() {
        if ($scope.chat.open) {
            $scope.chatclose();
        } else {
            $scope.chatopen();
        }
    }

    $scope.chatclose= function() {
        console.log("Closing down chat.");
        socket.send({'type': 'chatevent', 'content': 'part'});
    }

    $scope.chatopen = function() {
        console.log('Trying to open chat.');
        if ($scope.status.signedin) {
            console.log("Opening chat.");
            chatAside.$promise.then(chatAside.show());
            socket.send({'type': 'chatevent', 'content': 'join'});
        }

    //data-template="views/aside/chat.tpl.html" style="border-color: transparent; margin-left:5px;" data-placement="left" data-animation="am-slide-left" bs-aside="aside" data-container="body"

    }

    $scope.chatsend = function() {
        console.log("Transmitting current message.");
        socket.send({'type': 'chatmessage', 'content': $scope.chat.input});
        $scope.chat.input = "";
    }

    $scope.userlogin = function() {
        console.log('Trying to login.');

        var authpacket = {'type': 'auth', 'content': {
            'username': $scope.user.username,
            'password': md5.createHash($scope.user.password || ''),
            }
        };

        console.log('Sent:', authpacket);
        socket.send(authpacket);

    };

    $scope.userupdate = function() {
        if ($scope.status.connected === true) {

            console.log('Trying to update profile');

            if ($scope.status.signedin === false) {
                console.log('Not signed in, yet. Showing Login Modal');
                loginModal.$promise.then(loginModal.show);
            } else {
                console.log('Updating profile');
            }
        } else {
            console.log('I am not connected!');
        }

    }

    $scope.userprofile = function() {
        if ($scope.status.connected === true) {

            console.log('Handling login/profile display');

            if ($scope.status.signedin === false) {
                console.log('Not signed in, yet. Showing Login Modal');
                loginModal.$promise.then(loginModal.show);
            } else {
                console.log('Already signed in. Showing profile Modal');
                profileModal.$promise.then(profileModal.show);
            }
        } else {
            console.log('I am not connected!');
        }

    };

    socket.send({'type': 'info', 'content':'Menu activated'});

    socket.onMessage(function(message) {
        var data = JSON.parse(message.data);

        console.log(data);

        if(data.type === 'info') {
          if (data.content === 'Connected') {
            console.log('Client connected to HFOS');
            $scope.status.connected = true;
          } else {
            console.log('Unknown info message:', data.content);
          }
        } else if(data.type === 'warning') {
          var warningmodal = $modal({title: 'Warning!', content: String(data.content), show:true});
        } else if(data.type === 'auth') {
            console.log('Got an auth packet!');
            var auth = data.content;
            console.log(auth);
            if(auth.success) {
                console.log('Logged in successfully!');
                loginModal.hide();
                $scope.status.signedin = true;
                $scope.user.profile = auth.profile;
            } else {
                console.log('Failed to log in.');
            }
        } else if(data.type === 'chat') {
            console.log('Incoming chat data: ', data);
            $scope.chat.messages.push(data.content);
            console.log($scope.chat);
        };
    });
  });

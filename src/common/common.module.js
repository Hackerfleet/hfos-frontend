import angular from 'angular';

import UserInfoComponent from './component/user-info-component';

import UserService from './services/user.service';
import TodoService from './services/todo.service';
import AlertService from './services/alert.service';
import SocketService from './services/socket.factory';

import ngWebSocket from 'angular-websocket';

//console.log(socket);

console.log(SocketService);
console.log(ngWebSocket);

export default angular
    .module('main.app.common', [])
    .component('userInfoComponent', UserInfoComponent)
    .service('TodoService', TodoService)
    .service('alert', AlertService)
    .service('user', UserService)
    .service('socket', SocketService)
    .name;

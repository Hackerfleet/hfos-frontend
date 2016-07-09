import angular from 'angular';

import UserInfoComponent from './component/user-info-component';

import UserService from './services/user.service';
import MenuService from './services/menu.service';
import TodoService from './services/todo.service';
import AlertService from './services/alert.service';
import SocketService from './services/socket.factory';
import SchemataService from './services/schemata.service';
import ObjectProxy from './services/objectproxy.service';

import LoginController from './component/login-component';

export default angular
    .module('main.app.common', [])
    .component('userInfoComponent', UserInfoComponent)
    .service('TodoService', TodoService)
    .service('alert', AlertService)
    .service('user', UserService)
    .service('menu', MenuService)
    .service('socket', SocketService)
    .service('schemata', SchemataService)
    .service('objectproxy', ObjectProxy)
    .controller('LoginCtrl', LoginController)
    .name;

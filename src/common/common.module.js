import angular from 'angular';

import UserInfoComponent from './component/user-info-component';
import StatusbarController from './component/statusbar';

import UserService from './services/user.service';
import MenuService from './services/menu.service';
import TodoService from './services/todo.service';
import AlertService from './services/alert.service';
import SocketService from './services/socket.factory';
import SchemataService from './services/schemata.service';
import SystemconfigService from './services/system.service';
import ObjectProxy from './services/objectproxy.service';
import InfoscreenService from './services/infoscreen.service';

import LoginController from './component/login-component';

export default angular
    .module('main.app.common', [])
    .component('userInfoComponent', UserInfoComponent)
    .component('statusbarComponent', UserInfoComponent)
    .service('TodoService', TodoService)
    .service('alert', AlertService)
    .service('infoscreen', InfoscreenService)
    .service('user', UserService)
    .service('menu', MenuService)
    .service('socket', SocketService)
    .service('schemata', SchemataService)
    .service('systemconfig', SystemconfigService)
    .service('objectproxy', ObjectProxy)
    .controller('LoginCtrl', LoginController)
    .name;

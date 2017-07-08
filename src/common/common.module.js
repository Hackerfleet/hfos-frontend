/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2017 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
import Uppercase from './utils/filters';

import LoginController from './component/login-component';

export default angular
    .module('main.app.common', [])
    .filter('capitalize', Uppercase)
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

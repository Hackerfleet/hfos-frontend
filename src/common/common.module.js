/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2018 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import angular from 'angular';

import UserInfoComponent from './component/user-info-component';
import FileUploadComponent from './component/file-upload-component';

import UserService from './services/user.service';
import MenuService from './services/menu.service';
import TodoService from './services/todo.service';
import NotificationService from './services/notification.service';
import SocketService from './services/socket.factory';
import SchemataService from './services/schemata.service';
import SystemconfigService from './services/system.service';
import ObjectProxy from './services/objectproxy.service';
import InfoscreenService from './services/infoscreen.service';
import StatusbarService from './services/statusbar.service';
import capitalize from './utils/capitalize';
import toLength from './utils/toLength';
import range from './utils/range';
import OrderedObject from './utils/orderedObject';
import ObjectLength from './utils/objectLength';

import LoginController from './component/login-component';

import resizer from './component/resizer';

export default angular
    .module('main.app.common', [])
    .directive('resizer', resizer)
    .filter('capitalize', capitalize)
    .filter('toLength', toLength)
    .filter('range', range)
    .filter('orderedObject', OrderedObject)
    .filter('objectLength', ObjectLength)
    .component('userInfoComponent', UserInfoComponent)
    .component('fileUploadComponent', FileUploadComponent)
    .service('TodoService', TodoService)
    .service('notification', NotificationService)
    .service('infoscreen', InfoscreenService)
    .service('user', UserService)
    .service('menu', MenuService)
    .service('socket', SocketService)
    .service('schemata', SchemataService)
    .service('systemconfig', SystemconfigService)
    .service('objectproxy', ObjectProxy)
    .service('statusbar', StatusbarService)
    .controller('LoginCtrl', LoginController)
    .name;

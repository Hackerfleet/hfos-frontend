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
import uirouter from 'angular-ui-router';

import { routing } from './password.config.js';

import passwordcomponent from './component/password';
import passwordtemplate from './component/password.tpl.html';


export default angular
    .module('main.app.password', [uirouter])
    .config(routing)
    .component('password', {controller: passwordcomponent, template: passwordtemplate})
    .name;

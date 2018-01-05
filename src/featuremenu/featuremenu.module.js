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
import uirouter from 'angular-ui-router';

import gridster from 'angular-gridster';
import 'angular-gridster/dist/angular-gridster.min.css';

import { routing } from './featuremenu.config.js';

import featureMenu from './menu/menu.js';
import template from './menu/menu.tpl.html';

export default angular
    .module('main.app.featuremenu', [uirouter])
    .config(routing)
    .component('featuremenu', {controller: featureMenu, template: template})
    .name;

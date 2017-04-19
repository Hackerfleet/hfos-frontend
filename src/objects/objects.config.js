/*
 * Hackerfleet Operating System
 * =====================================================================
 * Copyright (C) 2011-2016 riot <riot@c-base.org> and others.
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

import configurationicon from '../../assets/images/icons/iconmonstr-wrench-4-icon.svg'

export function routing($stateProvider) {

    $stateProvider
        .state('app.editor', {
            url: '/editor/:schema/:uuid/:action',
            template: '<objecteditor></objecteditor>'
        })
        .state('app.list', {
            url: '/list/:schema',
            template: '<objectlist></objectlist>'
        })
        .state('app.config', {
            url: '/configuration',
            icon: configurationicon,
            label: 'Configuration',
            template: '<configurator></configurator>'
        });
}

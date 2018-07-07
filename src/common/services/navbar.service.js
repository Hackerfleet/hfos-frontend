/*
 * Hackerfleet Operating NAVtem
 * ============================
 * Copyright (C) 2011 - 2018 riot <riot@c-base.org> and others.
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

'use strict';

/**
 * Created by riot on 21.02.16.
 */


class NavbarService {

    constructor(compile) {
        console.log('[NAV] NavbarService constructing');
        //this.rootscope = rootscope;
        this.compile = compile;
        //this.interpolate = $interpolate;

        this.scope = null;
        this.things_to_add = [];

        console.log('[NAV] NavbarService constructed');

        let self = this;

        this.add_now = function(thing_name) {
            console.log('[NAV] Adding thing:', thing_name, self.scope);
            let thing = angular.element(document.createElement(thing_name));
            //let el = this.compile(thing, this);
            console.log('[NAV] Thing:', thing);
            let element = self.compile(thing)(self.scope);
            console.log('[NAV] El:', element);
            angular.element('#custom_buttons').append(element);
        };

        this.set_scope = function(scope) {
            self.scope = scope;

            for (let thing_name of self.things_to_add) {
                self.add_now(thing_name);
            }
        };

        this.add = function(thing_name) {
            if (self.scope !== null) {
                self.add_now(thing_name);
            } else {
                this.things_to_add.push(thing_name);
            }
        }
    }
}

NavbarService.$inject = ['$compile'];

export default NavbarService;

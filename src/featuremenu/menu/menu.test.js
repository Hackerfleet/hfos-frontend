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

import { assert } from 'chai';

import featureMenu from './menu.js';

let component;

describe('featureMenu', function () {

    beforeEach(function () {
        component = new SomeComponent();
    });

    it('should start with default counter value = 20', function () {
        assert.equal(component.counter, 20);
    });

    it('should accept initial counter value as dependency', function () {
        component = new SomeComponent(30);
        assert.equal(component.counter, 30);
    });

    it('should increment counter value after increment is called', function () {
        assert.equal(component.counter, 20);
        component.increment();
        assert.equal(component.counter, 21);
    });

});

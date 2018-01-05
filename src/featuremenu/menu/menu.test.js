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

import { assert } from 'chai';

import FeatureMenu from './menu.js';
import UserService from '../../common/services/user.service.js';

let component;

describe('FeatureMenu', function () {
    beforeEach(function() {
        let userService = new UserService();
        component = new FeatureMenu(userService);
        console.log('component:', component)
    });

    it('should start with an unlocked state', function () {
        assert.equal(component.lockState, false);
    });
});

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

import AboutComponent from './about-component.js';

let component;

describe('AboutComponent test', function () {

    beforeEach(function () {
        component = new AboutComponent();
    });

    it('should contain reference to service\'s abouts', function () {
        assert.equal(component.abouts.length, 0);
    });

    it('should add about', function () {
        component.label = 'Finish example project';
        component.addAbout();
        assert.equal(component.label, '');
        assert.equal(component.abouts.length, 1);
        assert.equal(component.abouts[0].label, 'Finish example project');
        assert.equal(component.abouts[0].done, false);
    });

    it('should toggle about', function () {
        component.label = 'Finish example project';
        component.addAbout();
        assert.equal(component.abouts[0].done, false);

        component.toggleAbout(component.abouts[0]);
        assert.equal(component.abouts[0].done, true);

        component.toggleAbout(component.abouts[0]);
        assert.equal(component.abouts[0].done, false);
    });

    it('should remove done abouts', function () {
        component.label = 'About1';
        component.addAbout();

        component.label = 'About2';
        component.addAbout();

        component.label = 'About2';
        component.addAbout();

        assert.equal(component.abouts.length, 3);

        component.toggleAbout(component.abouts[0]);
        component.removeDoneAbouts();
        assert.equal(component.abouts.length, 2);
    });

});

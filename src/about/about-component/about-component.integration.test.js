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

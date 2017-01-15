/*
 @DEV: EDIT THE TEMPLATE, NOT THE ACTUAL CONFIGURATION
 Otherwise, your changes will be overwritten by the
 frontend build process.
 */

// DO NOT EDIT MAIN.JS! IF YOU NEED TO CHANGE ANYTHING
// HERE, CHANGE THE TEMPLATE. OTHERWISE, YOUR CHANGES
// WILL BE LOST.

// Styles
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap-additions/dist/bootstrap-additions.css';
import 'angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.css';
import 'angular-ui-select/select.css';
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css'
import 'spectrum-colorpicker/spectrum.css';

import './main.scss';

// 3rd party modules
import 'jquery';
//import bootstrap from 'bootstrap';
import angular from 'angular';
import sanitize from 'angular-sanitize';
import 'underscore/underscore';
import 'angular-underscore';
import 'angular-ui-utils/modules/utils';
import animate from 'angular-animate';
import cookies from 'angular-cookies';
import 'ng-draggable';
import '@kariudo/angular-fullscreen';
import touch from 'angular-touch';
import translate from 'angular-translate';
import clipboard from 'angular-clipboard';
import ui from 'angular-ui-bootstrap';
import calendar from 'angular-bootstrap-calendar';

require('spectrum-colorpicker/spectrum');
require('angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker');

require('bootstrap-slider');
require('angular-bootstrap-slider');


// HFOS Core Modules
import app from './app/app.module';
import common from './common/common.module';
import featuremenu from './featuremenu/featuremenu.module';
import objects from './objects/objects.module';
import about from './about/about.module';
import doc from './doc/doc.module';

require('humanize-duration');

// HFOS Plugin Modules

let modules = ['mgcrea.ngStrap', 'gridster', 'ngDraggable', 'FBAngular', 'ui.bootstrap-slider', 'angularSpectrumColorpicker',
    animate, app, common, objects, cookies, sanitize, touch, translate, ui, featuremenu, about, doc,
    clipboard.name, calendar
];

/* COMPONENT SECTION */

/* COMPONENT SECTION */

angular.module('main', modules);

angular.element(document).ready(() => {
    angular.bootstrap(document, ['main']);
});


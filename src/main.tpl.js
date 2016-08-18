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

import './main.scss';

// 3rd party modules
//import bootstrap from 'bootstrap';
import angular from 'angular';
import animate from 'angular-animate';
import cookies from 'angular-cookies';
import draggable from 'ng-draggable';
import fullscreen from '@kariudo/angular-fullscreen';
import touch from 'angular-touch';
import md5 from 'angular-md5';
import translate from 'angular-translate';
import clipboard from 'angular-clipboard';
import ui from 'angular-ui-bootstrap';
import calendar from 'angular-bootstrap-calendar';

// HFOS Core Modules
import app from './app/app.module';
import common from './common/common.module';
import featuremenu from './featuremenu/featuremenu.module';
import objects from './objects/objects.module';
import about from './about/about.module';
import doc from './doc/doc.module';

require('humanize-duration');

// HFOS Plugin Modules

let modules = ['mgcrea.ngStrap', 'gridster', 'schemaForm', 'ui.select', 'ngDraggable', 'FBAngular',
    animate, app, common, objects, cookies, touch, translate, md5, ui, featuremenu, about, doc, clipboard.name, calendar
];

/* COMPONENT SECTION */

/* COMPONENT SECTION */

angular.module('main', modules);

angular.element(document).ready(() => {
    angular.bootstrap(document, ['main']);
});


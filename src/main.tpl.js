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
//import './themes/nightshift/bootstrap.css';

import 'bootstrap-additions/dist/bootstrap-additions.css';
import 'angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.css';
import 'ui-select/dist/select.css';
import 'bootstrap-slider/dist/css/bootstrap-slider.min.css';
import 'angular-ui-tree/dist/angular-ui-tree.min.css';
import 'ng-table/bundles/ng-table.css';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'highlight.js/styles/default.css';
import 'ng-embed/dist/ng-embed.min.css';

import './main.scss';

// 3rd party modules
require('jquery');
//import bootstrap from 'bootstrap';
require('moment');
require('fullcalendar');
import angular from 'angular';
import sanitize from 'angular-sanitize';
import 'angular-gettext';
import 'underscore/underscore';
import 'angular-underscore';
import 'angular-ui-utils/modules/utils';
import animate from 'angular-animate';
import cookies from 'angular-cookies';
import 'ui-select/dist/select';
import 'ng-draggable';
import '@kariudo/angular-fullscreen';
import touch from 'angular-touch';
import translate from 'angular-translate';
import clipboard from 'angular-clipboard';
import ui from 'angular-ui-bootstrap';
import ngcalendar from 'angular-bootstrap-calendar';
import 'angular-ui-calendar';
import tree from 'angular-ui-tree';
import localstorage from 'angular-local-storage';
require('angular-strap/dist/angular-strap.min');
require('angular-strap/dist/angular-strap.tpl.min');

import hlsj from 'highlight.js/lib/index';

require('ng-embed/dist/ng-embed.min');
require('spectrum-colorpicker');
require('angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker');
import 'spectrum-colorpicker/spectrum.css';

require('angular-spinner');
require('bootstrap-slider');
require('angular-bootstrap-slider');
require('angular-uuid');
require('angularjs-scroll-glue/src/scrollglue');
require('angular-moment');
import ngTableModule from 'ng-table/bundles/ng-table';

require('humanize-duration');

import qrcode from 'qrcode-generator';
//import qrcode_UTF8 from '/node_modules/qrcode-generator/qrcode_UTF8.js';
import ngQrcode from 'angular-qrcode';

// HFOS Core (Sails) Modules
import app from './app/app.module';
import common from './common/common.module';
import featuremenu from './featuremenu/featuremenu.module';
import objects from './objects/objects.module';
import about from './about/about.module';
import systemlog from './systemlog/systemlog.module';
import doc from './doc/doc.module';

// HFOS Plugin Modules

let modules = ['mgcrea.ngStrap', 'gridster', 'ngDraggable', 'FBAngular', 'ui.bootstrap-slider', 'angularSpectrumColorpicker',
    'angularSpinner', 'angular-uuid', 'luegg.directives', 'angularMoment', 'ngTable', 'ui.calendar', 'ngEmbed', 'gettext',
    animate, app, common, objects, cookies, sanitize, touch, translate, ui, featuremenu, about, systemlog,
    doc, clipboard.name, ngcalendar, tree, localstorage, ngQrcode
];

/* COMPONENT SECTION */

/* COMPONENT SECTION */

angular.module('main', modules)
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('HFOS');
        // localStorageServiceProvider.setStorageCookieDomain('example.com');
        // localStorageServiceProvider.setStorageType('sessionStorage');
    })
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/missing');
    }])
    .constant('moment', require('moment-timezone'))
    .run(function ($rootScope, $state) {
        // register listener to watch route changes
        $rootScope.$on("$stateChangeStart", function (event, nextState, nextParams, fromState, fromParams) {
            console.log('Changing route, rootscope:', $rootScope, $rootScope.has_password, $rootScope.logged_in);
            if ($rootScope.has_password === false && $rootScope.logged_in === true) {
                console.log('Logged in, but no password', nextState);
                // no logged user, we should be going to #login
                if (nextState.name === "app.password") {
                    // already going to #login, no redirect needed
                    console.log('Going to password change already');
                } else {
                    console.log('Redirecting to password change component');
                    event.preventDefault();
                    $state.go('app.password');
                }
            }
        });
    });

angular.element(document).ready(() => {
    angular.bootstrap(document, ['main']);
});

function boot() {
    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
}

//document.addEventListener('DOMContentLoaded', boot);

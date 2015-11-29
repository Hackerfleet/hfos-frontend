'use strict';

/**
 * @ngdoc overview
 * @name hfosFrontendApp
 * @description
 * # hfosFrontendApp
 *
 * Main module of the application.
 */
angular
    .module('hfosFrontendApp', [
        'ngAnimate',
        'mgcrea.ngStrap',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSocket',
        'ngSanitize',
        'ngTouch',
        'angular-md5',
        'pascalprecht.translate',
        'leaflet-directive',
        'fundoo.services',
        'schemaForm',
        'schemaForm-tinymce',
        'angular-detector',
        'routeStyles',
        'ngFitTextDynamic',
        'ngRadialGauge',
        'gridster',
        'frapontillo.bootstrap-switch',
        'ui.select',
        'mgcrea.ngStrap.select',
        'ngDraggable'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html'
                //controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/map', {
                templateUrl: 'views/map.html',
                controller: 'MapCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
                css: 'styles/dashboard.css'
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/gamepadremote', {
                templateUrl: 'views/gamepadremote.html',
                controller: 'GamepadRemoteCtrl',
                css: 'styles/gamepadremote.css'
            })
            .when('/library', {
                templateUrl: 'views/library.html',
            })
            .when('/tasks', {
                templateUrl: 'views/taskgrid.html',
                controller: 'TaskGridCtrl'
            })
            .when('/wiki', {
                templateUrl: 'views/wiki.html',
                controller: 'WikiCtrl'
            })
            .when('/wiki/:slug*', {
                templateUrl: 'views/wiki.html',
                controller: 'WikiCtrl'
            })
            .when('/obj/:schema/:uuid/:action?', {
                templateUrl: 'views/objecteditor.html',
                controller: 'ObjectEditorCtrl'
            })
            .when('/list/:schema', {
                templateUrl: 'views/objectlist.html',
                controller: 'ObjectListCtrl'
            })
            .when('/docs', {
                templateUrl: 'views/docs.html'
            })

            .otherwise({
                redirectTo: '/'
            });

    });

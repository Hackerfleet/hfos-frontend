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
        'leaflet-directive',
        'fundoo.services',
        'schemaForm',
        'schemaForm-tinymce',
        'angular-detector',
        'routeStyles',
        // 'angularDeckster',
        'ngFitTextDynamic',
        'ngRadialGauge',
        'gridster'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
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
                controller: 'DashboardCtrl'
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
            .when('/wiki', {
                templateUrl: 'views/wiki.html',
                controller: 'WikiCtrl',
            })
            .when('/wiki/:slug*', {
                templateUrl: 'views/wiki.html',
                controller: 'WikiCtrl'
            })
            .when('/obj/:schema/:uuid', {
                templateUrl: 'views/objecteditor.html',
                controller: 'ObjectEditorCtrl'
            })


            .otherwise({
                redirectTo: '/'
            });
        /*
        decksterConfigProvider.set({
         decks: {
                'Dashboard': {
                    'cards': [
                        {
                            id: 'bearing',
                            size: {x: 2, y: 1},
                            position: [2, 0],
                            value: 'Heading_True'
                        },
                        {
                            id: 'gauge',
                            size: {x: 2, y: 2},
                            position: [0, 2],
                            value: 'GPS_SatCount'
                        },
                        {

                            id: 'digital',
                            size: {x: 2, y: 1},
                            position: [0, 0],
                            value: 'GPS_LatLon'
                        }]
                }
            },
            cardDefaults: {
                'bearing': {
                    title: 'Bearing',
                    summaryTemplateUrl: 'views/cards/courseSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/courseDetailsTemplate.html'
                },
                'gauge': {
                    title: 'Gauge',
                    summaryTemplateUrl: 'views/cards/analogReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/analogReadoutDetailsTemplate.html'
                },
                'digital': {
                    title: 'Digital',
                    summaryTemplateUrl: 'views/cards/digitalReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/digitalReadoutDetailsTemplate.html'
                }
            }
         }); */
    });

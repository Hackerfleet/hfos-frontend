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
        'angularDeckster',
        'ngFitTextDynamic',
        'ngRadialGauge'
    ])
    .config(function ($routeProvider, decksterConfigProvider) {
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

        decksterConfigProvider.set({
            /*decks: {  // TODO: evaluate if this feat is really useful to us. I think so.
             'testDeck': {
             cards: [
             {
             title: 'Card 1',
             id: 'card-1',
             size: {x: 1, y: 1},
             position: [0, 0]
             },
             {
             title: 'Card 2',
             id: 'card-2',
             size: {x: 2, y: 2},
             position: [0, 1],
             value: 0.5
             },
             {
             title: 'Card 3',
             id: 'card-3',
             size: {x: 1, y: 1},
             position: [0, 2]
             }
             ]
             }
             },*/
            cardDefaults: {
                'course': {
                    summaryTemplateUrl: 'views/cards/courseSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/courseDetailsTemplate.html'
                },
                'analog': {
                    summaryTemplateUrl: 'views/cards/analogReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/analogReadoutDetailsTemplate.html'
                },
                'digital': {
                    summaryTemplateUrl: 'views/cards/digitalReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/digitalReadoutDetailsTemplate.html'
                }
            }
        });
    });

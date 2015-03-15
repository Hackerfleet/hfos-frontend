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
    'angular-detector'
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
      .otherwise({
        redirectTo: '/'
      });
  });

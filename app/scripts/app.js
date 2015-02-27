'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'mgcrea.ngStrap',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSocket',
    'ngSanitize',
    'ngTouch',
    'angular-md5',
    'leaflet-directive'
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('socket', function(ngSocket) {
    var sock = ngSocket('ws://localhost:8055/websocket');
    //sock.onMessage(function(args) {
    //    console.log(args);
    //});

    return sock;
  });

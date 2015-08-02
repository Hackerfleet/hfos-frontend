'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:LogbookCtrl
 * @description
 * # LogbookCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('LogbookCtrl', function ($scope, ObjectProxy) {

        ObjectProxy.getlist('logbook', {}, ['time', '']);

    });

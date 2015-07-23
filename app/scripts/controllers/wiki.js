'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:WikiCtrl
 * @description
 * # WikiCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('WikiCtrl', function ($scope, $routeParams, Wiki) {
        var pagename = $routeParams.slug;
        if (pagename) {
            $scope.pagename = pagename;
        } else {
            $scope.pagename = 'Index';
        }

        Wiki.get($scope.pagename);

        $scope.editing = false;
        $scope.pagedata = 'No specific text';
        $scope.pagedata = Wiki.pages[$scope.pagename];

        $scope.$on('User.Login', function (ev) {
            Wiki.get($scope.pagename);
        });

        $scope.$on('Wiki.Change', function (ev, pagename) {
            console.log('Wiki page has been updated from node, checking..', ev, pagename);
            console.log(Wiki.getpages());
            if (pagename === $scope.pagename) {
                console.log('Wiki page changed, updating content.');
                $scope.pagedata = Wiki.pages[pagename];
            }
        });
    });

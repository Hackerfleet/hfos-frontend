'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:WikiCtrl
 * @description
 * # WikiCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('WikiCtrl', function ($scope, $route, $routeParams, schemata, Wiki) {
        var pagename = $routeParams['slug'];

        if (pagename) {
            $scope.pagename = pagename;
        } else {
            $scope.pagename = 'Index';
        }

        Wiki.get($scope.pagename);

        $scope.url = window.location.href;
        $scope.editing = false;
        $scope.schema = schemata.schema['wikipage'];
        $scope.pagedata = 'No specific text';
        $scope.pagedata = Wiki.pages[$scope.pagename];

        $scope.form = [
            {
                type: 'section',
                htmlClass: 'row',
                items: [
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'pagedata.name'
                        ]
                    },
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'pagedata.title'
                        ]
                    }
                ]
            },
            'pagedata.text',
            {
                type: 'submit',
                title: 'Save',
            }
        ];

        $scope.$on('Schemata.Update', function () {
            console.log('Got a schema update:', schemata.schema['wikipage']);
            $scope.schema = schemata.schema['wikipage'];
        });

        $scope.$on('User.Login', function () {
            console.log('User logged in, getting current page.');
            $scope.schema = schemata.get('wikipage');
            // TODO: Check if user modified page - offer merging
            Wiki.get($scope.pagename);
        });

        $scope.$on('Wiki.Change', function (ev, pagename) {
            console.log('Wiki page has been updated from node, checking..', ev, pagename);
            console.log(Wiki.getpages());
            if (pagename === $scope.pagename) {
                console.log('Wiki page changed, updating content.');
                $scope.pagedata = Wiki.pages[pagename];
            }
            console.log('Schema', $scope.schema);
        });
    });

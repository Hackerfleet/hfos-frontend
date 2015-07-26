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
        $scope.schema = schemata.get('wikipage');
        $scope.pagedata = 'No specific text';
        $scope.pagedata = Wiki.pages[$scope.pagename];
        $scope.model = {};

        $scope.$on('Schemata.Update', function () {
            console.log('Got a schema update:', schemata.schema['wikipage']);
            $scope.schema = schemata.get('wikipage');
        });

        $scope.$on('User.Login', function () {
            console.log('User logged in, getting current page.');
            // TODO: Check if user modified page - offer merging
            Wiki.get($scope.pagename);
        });

        $scope.$on('Wiki.Stored', function (ev, pagename) {
            console.log('[WIKI] Marking page as stored.');
            $('#wikiPageStored').removeClass('hidden');
            $('#wikiPageModified').addClass('hidden');
            $('#wikiEditor').addClass("hidden");
            $('#wikiEditButton').removeClass("active");
        });

        $scope.$on('Wiki.Change', function (ev, pagename) {
            console.log('Wiki page has been updated from node, checking..', ev, pagename);
            console.log(Wiki.getpages());
            if (pagename === $scope.pagename) {
                console.log('Wiki page changed, updating content.');
                $scope.pagedata = Wiki.pages[pagename];
                $scope.model = Wiki.pages[pagename];
                $('#wikiPageModified').addClass('hidden');

                $('#wikiEditButton').removeClass("hidden");
                $scope.$apply();
            }
            console.log('Schema', $scope.schema);
        });

        $scope.openEditor = function () {
            console.log('Opening wiki editor');
            $('#wikiEditor').toggleClass("hidden");
            $('#wikiEditButton').toggleClass("active");
        };

        var editorChange = function () {
            if ($scope.model !== Wiki.pages[pagename]) {
                console.log("[WIKI] Content has been modified locally.")

                $('#wikiPageModified').removeClass('hidden');
            } else {
                console.log('[WIKI] Content changed from somewhere else.');
                console.log($scope.model, Wiki.pages[pagename]);
            }
        };

        $scope.$watchCollection('model', editorChange);

        $scope.submitForm = function (model) {
            console.log('Wiki page update initiated with ', model);
            Wiki.put(pagename, model);
            //user.updateprofile(model);
        };

        $scope.form = [
            {
                type: 'section',
                htmlClass: 'row',
                items: [
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            {
                                key: 'name',
                            }
                        ]
                    },
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'title'
                        ]
                    }
                ]
            },
            {
                key: 'text',
            },
            {
                type: 'submit',
                title: 'Save'
            },
        ];

    });

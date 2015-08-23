'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:ObjectEditorCtrl
 * @description
 * # ObjectEditorCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('ObjectEditorCtrl', function ($scope, $routeParams, ObjectProxy, user, schemata) {
        $scope.uuid = $routeParams.uuid;


        if ($scope.uuid === 'create') {
            $scope.action = 'Create';
            $('#objModified').removeClass('hidden');
        } else {
            $scope.action = 'Edit';
        }

        $scope.schemaname = $routeParams.schema;
        $scope.schemadata = {};
        $scope.model = {};

        if (user.signedin()) {
            console.log('[OE] Requesting schemata and object.');
            $scope.schemadata = schemata.get($scope.schemaname);
            ObjectProxy.get($scope.schemaname, $scope.uuid);
        }

        ObjectProxy.get($scope.schemaname, $scope.uuid);

        $scope.$on('Schemata.Update', function () {
            var newschema = schemata.schema($scope.schemaname);
            console.log('[OE] Got a schema update:', newschema);
            $scope.schemadata = schemata.get($scope.schemaname);
        });

        $scope.$on('User.Login', function () {
            console.log('[OE] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            $scope.schemadata = schemata.get($scope.schemaname);
            ObjectProxy.get($scope.schemaname, $scope.uuid);
        });

        var markStored = function () {
            console.log('[OE] Marking object as stored.');
            $('#objStored').removeClass('hidden');
            $('#objModified').addClass('hidden');
            $scope.action = 'Edit';
        };

        $scope.$on('OP.Stored', function (ev, uuid) {
            if (uuid === $scope.uuid) {
                markStored();
            } else if ($scope.uuid === 'create') {
                // TODO: What if another object is being created right now?
                // We could check if the object body is the same.
                // (Works bad on objects that are somehow modified before saving them)
                $scope.uuid = uuid;
                markStored();
            }
        });

        $scope.$on('OP.Change', function (ev, uuid) {
            console.log('[OE] Object has been updated from node, checking..', ev, uuid);

            // TODO: This could fail and possibly catch the wrong object
            if ($scope.uuid === 'create') {
                $scope.uuid = uuid;
            }

            if (uuid === $scope.uuid) {
                console.log('[OE] Object changed, updating content.');
                $scope.model = ObjectProxy.obj[uuid];
                console.log('[OE] Object model: ', $scope.model);
                $('#objectModified').addClass('hidden');
                $('#objectEditButton').removeClass('hidden');
                $scope.$apply();
            }
        });

        /*var editorChange = function () {
         if ($scope.model !== objectproxy.obj[$scope.uuid]) {
         console.log('[OE] Content has been modified locally.');

         $('#objectModified').removeClass('hidden');
         } else {
         console.log('[OE] Content changed from somewhere else.');
         console.log($scope.model, objectproxy.obj[$scope.uuid]);
         }
         };

         $scope.$watchCollection('model', editorChange);
         */
        $scope.submitForm = function (model) {
            console.log('[OE] Object update initiated with ', model);
            ObjectProxy.put($scope.schemaname, model);
        };
    });

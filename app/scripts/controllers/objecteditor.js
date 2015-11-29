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
        $scope.action = $routeParams.action;


        if ($scope.uuid === 'create') {
            $scope.action = 'Create';
            $('#objModified').removeClass('hidden');
        } else {
            $scope.action = 'Edit';
        }

        $scope.schemaname = $routeParams.schema;
        $scope.schemascreenname = $scope.schemaname.charAt(0).toUpperCase() + $scope.schemaname.slice(1);
        $scope.schemadata = {};
        $scope.model = {};

        var getData = function () {
            console.log('[OE] Requesting schemata.');
            $scope.schemadata = schemata.get($scope.schemaname);
            if ($scope.action !== 'Create') {
                console.log('[OE] Requesting object.');
                ObjectProxy.get($scope.schemaname, $scope.uuid);
            }
        };

        if (user.signedin()) {
            getData();
        }

        $scope.callBackSD = function (schema) {
            console.log('[OE] Callback getting entries: ', schema);
            var origlist = ObjectProxy.lists[schema];
            console.log('[OE] Callback results: ', origlist);
            return origlist;

        };

        $scope.getFormData = function (options, search) {
            console.log('[OE] Trying to obtain proxy list.', options, search);
            var result = ObjectProxy.newgetlist(options.type, search);
            console.log(result);
            return result;
        };

        //console.log("[OE] CB Results: ", $scope.Callback('mapview'));

        $scope.$on('User.Login', function () {
            console.log('[OE] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            getData();
        });

        $scope.$on('Schemata.Update', function () {
            var newschema = schemata.schema($scope.schemaname);
            console.log('[OE] Got a schema update:', newschema);
            $scope.schemadata = schemata.get($scope.schemaname);
            // TODO: getData?
        });

        var markStored = function () {
            console.log('[OE] Marking object as stored.');
            $('#objStored').removeClass('hidden');
            $('#objModified').addClass('hidden');
            $scope.action = 'Edit';
        };

        $scope.$on('OP.Put', function (ev, uuid) {
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

        $scope.$on('OP.Get', function (ev, uuid) {
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

            if ($scope.action === 'Create') {
                model.uuid = 'create';
            }
            console.log('[OE] Object update initiated with ', model);
            ObjectProxy.put($scope.schemaname, model);
        };
    });

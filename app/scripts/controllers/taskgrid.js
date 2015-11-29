'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:TaskGridCtrl
 * @description
 * # TaskGridCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('TaskGridCtrl', function ($scope, user, ObjectProxy) {


        ObjectProxy.getlist('task', {}, ['name', 'status', 'priority']);

        $scope.tasklist = [];
        $scope.tasks = [];

        $scope.columns = {};

        $scope.columnsVisible = {
            'Open': 0,
            'Waiting': 1,
            'In progress': 2,
            'Closed': 3,
            'Resolved': -1,
            'Duplicate': -1,
            'Invalid': -1,
            'Cannot reproduce': -1
        };


        $scope.opentab = function (tabname) {
            console.log('[TASKGRID] Switching tab to ', tabname);
            $('.nav-pills .active, .tab-content .active').removeClass('active');
            $('#' + tabname).addClass('active');
        };

        $scope.updateVisibleColumns = function () {
            $scope.items = [];
            populateHeaders();

            for (var i in $scope.tasklist) {
                var task = $scope.tasklist[i];
                console.log($scope.columns, task.status);
                if ($scope.columnsVisible[task.status] !== -1) {
                    var newitem = {
                        'name': task.name,
                        'uuid': task.uuid,
                        'drag': true,
                        'priority': task.priority,
                        'status': task.status,
                        'url': 'obj/task/' + task.uuid + '/edit',
                        'row': task.priority
                    };
                    $scope.columns[task.status].push(newitem);
                }
            }
            console.log('Tasks', $scope.columns);

        };

        function populateHeaders() {
            $.each($scope.columnsVisible, function (key, value) {
                if (value !== -1) {
                    $scope.columns[key] = [];
                }
            });
            console.log($scope.items);
        }

        $scope.onDropComplete = function (task, ev, status) {
            console.log("DropComplete: ", task, ev, status);
            var tasklist = $scope.columns[task.status];
            console.log($scope.columns[task.status]);

            $scope.columns[task.status].splice(tasklist.indexOf(task), 1);
            task.status = status;

            $scope.columns[status].push(task);
            console.log($scope.columns);

        };

        $scope.$on('OP.ListUpdate', function (event, schema) {
            $scope.tasklist = ObjectProxy.lists[schema];
            console.log($scope.tasklist);
            $scope.updateVisibleColumns();
        });

        $scope.updateVisibleColumns();
    });

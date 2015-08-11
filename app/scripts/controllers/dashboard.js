'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('DashboardCtrl', function ($scope, navdata, user, socket, createDialog, ObjectProxy) {


        socket.send({'type': 'info', 'content': 'Dashboard activated'});

        /*decksterConfig.set({
         decks: {  // TODO: evaluate if this feat is really useful to us. I think so.
         }
         });*/


        $scope.deckOptions = {
            id: 'Dashboard',
            gridsterOpts: { // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
                columns: 5,
                rowHeight: 150,
                margins: [10, 10]
            }
        };

        $scope.dashboarduuid = user.clientconfig()['dashboarduuid'];
        $scope.dashboard = {};

        ObjectProxy.get('dashboard', $scope.dashboarduuid);

        var resetDashboard = function () {
            console.log('[DASH] Resetting dashboard to ', $scope.dashboarduuid);
            $scope.dashboard = ObjectProxy.obj[$scope.dashboarduuid];
            console.log($scope.dashboard);
            //console.log(decksterConfig);


        };

        $scope.$on('OP.Change', function (ev, uuid) {
            if (uuid === $scope.dashboarduuid) {
                console.log('[DASH] Received dashboard configuration');
                resetDashboard();
            }
        });

        $scope.$on('Clientconfig.Update', function () {
            console.log('[DASH] New dashboard configured, adapting');
            $scope.dashboarduuid = user.clientconfig()['dashboarduuid'];
            ObjectProxy.get('dashboard', $scope.dashboarduuid);
        });

        $scope.configureCards = function () {
            console.log('[DASH] Opening configuration');
            createDialog('/views/modals/dashboardconfig.tpl.html', {
                    id: 'DashboardConfig',
                    title: 'Dashboard configuration',
                    backdrop: false,
                    footerTemplate: '<span></span>',
                    controller: 'DashboardConfigCtrl'
                }, {}
            );
        };

    }).controller('CustomWidgetCtrl', ['$scope', '$modal',
        function ($scope, $modal) {

            $scope.remove = function (widget) {
                $scope.dashboard.cards.splice($scope.dashboard.cards.indexOf(widget), 1);
            };

            $scope.openSettings = function (widget) {
                $modal.open({
                    scope: $scope,
                    templateUrl: 'demo/dashboard/widget_settings.html',
                    controller: 'WidgetSettingsCtrl',
                    resolve: {
                        widget: function () {
                            return widget;
                        }
                    }
                });
            };

        }
    ]).controller('DashboardConfigCtrl', ['$scope', 'navdata', 'config', 'user', 'ObjectProxy',
        function ($scope, navdata, config, user, ObjectProxy) {
            $scope.dashboardlist = ObjectProxy.getlist('dashboard', {'useruuid': user.user().uuid}, ['name', 'description']);

            $scope.$on('OP.ListUpdate', function (ev, schema) {
                console.log('[DASHBOARDCONFIG] List update:', schema);

                if (schema === 'dashboard') {
                    console.log('[DASHBOARDCONFIG] Dashboardconfig list updating');
                    $scope.dashboardlist = ObjectProxy.lists['dashboard'];
                    $scope.$apply();
                }
            });

            $scope.selectDashboard = function (uuid) {
                console.log('[DASHBOARDCONFIG] Updating dashboard selection');
                var origconf = user.clientconfig();
                console.log(origconf);
                origconf.dashboarduuid = uuid;
                user.updateclientconfig(origconf);
            };

        }]);

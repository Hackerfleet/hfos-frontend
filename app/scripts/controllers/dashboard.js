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
                columns: 3,
                rowHeight: 150,
                margins: [10, 10]
            }
        };

        $scope.dashboarduuid = user.clientconfig()['dashboarduuid'];
        $scope.dashboard = {};

        $scope.referenceframe = {};
        $scope.observed = [];

        ObjectProxy.get('dashboard', $scope.dashboarduuid);

        var updateObserved = function () {
            console.log('[DASH] Updating observed values from ', $scope.dashboard.cards);
            $scope.observed = [];
            for (var card in $scope.dashboard.cards) {
                console.log('[DASH]', $scope.dashboard.cards[card]);
                $scope.observed.push($scope.dashboard.cards[card].valuetype);
            }
            console.log($scope.observed);
        };

        var resetDashboard = function () {
            console.log('[DASH] Resetting dashboard to ', $scope.dashboarduuid);
            $scope.dashboard = ObjectProxy.obj[$scope.dashboarduuid];
            console.log($scope.dashboard);
            //console.log(decksterConfig);
            updateObserved();
        };

        $scope.opentab = function (tabname) {
            console.log('[DASH] Switching tab to ', tabname);
            $('.nav-pills .active, .tab-content .active').removeClass('active');
            $('#' + tabname).addClass('active');
        };

        $scope.$on('hfos.NavdataUpdate', function () {
            var framedata = navdata.frame();
            var frameages = navdata.ages();
            var now = new Date().getTime();
            console.log("Updating Dashboard");
            for (var property in framedata) {
                var data = {
                    value: framedata[property],
                    birth: frameages[property],
                    age: humanizeDuration(((now / 1000) - frameages[property]) * 1000, {round: true}),
                    observed: $scope.observed.indexOf(property) >= 0
                };
                $scope.referenceframe[property] = data;
            }


        });

        $scope.$on('OP.Get', function (ev, uuid) {
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

        $scope.toggleDashboardItem = function (key) {
            if ($scope.observed.indexOf(key) >= 0) {
                console.log('[DASH] Removing ', key, ' from dashboard.');
                for (card in $scope.dashboard.cards) {
                    if ($scope.dashboard.cards[card].valuetype === key) {
                        $scope.dashboard.cards.pop(card);
                    }
                }
            } else {
                console.log('[DASH] Adding ', key, ' to dashboard.');
                var card = {
                    'widgettype': 'DigitalDashboardCtrl',
                    'valuetype': key,
                    'title': key
                };
                $scope.dashboard.cards.push(card);
            }
            console.log('[DASH] Putting new dashboard: ', $scope.dashboard);
            ObjectProxy.put('dashboard', $scope.dashboard);
            updateObserved();
        };


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
            $scope.dashboardlist = ObjectProxy.getlist('dashboard', {
                '$or': [
                    {'useruuid': user.user().uuid},
                    {'shared': true}]
            }, ['name', 'description']);

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

        }]).directive('ngDynamicController', ['$compile', '$http', function ($compile, $http) {
        return {
            scope: {
                widgettype: '=ngDynamicController',
                valuetype: '='
            },
            restrict: 'A',
            transclude: true,
//            terminal: true,
//            priority: 100000,
            link: function (scope, elem, attrs) {
                console.log('[NGDC] SCOPE:', scope, attrs);
                elem.attr('ng-controller', scope.widgettype);
                elem.removeAttr('ng-dynamic-controller');

                $http.get('/views/cards/' + scope.widgettype + '.html')
                    .then(function (response) {
                        console.log('[NGDC] Html Response:', response.data);
                        elem.append(response.data);
                        $compile(elem)(scope);
                    });
                /*var build = function (html) {
                 element.empty().append($compile(html)(scope));
                 };
                 scope.$watch('widget.template', function (newValue, oldValue){
                 if (newValue) {
                 build(newValue);
                 }
                 });

                 /*
                 var build = function (html) {
                 //    $http.get('/views/cards/' + html + '.html')
                 .then(function(response){
                 //var linkFn = $compile(response.data)(scope);
                 //elem.html(linkFn(scope));
                 console.log(elem);
                 elem.attr('ng-controller', scope.widgettype);
                 console.log(elem);
                 elem.removeAttr('ng-dynamic-controller');
                 console.log(elem);
                 elem.append($compile(response.data)(scope));
                 console.log(elem);
                 });
                 //elem.empty().append($compile(html)(scope));
                 };
                 scope.$watch('widgettype', function (newValue, oldValue) {
                 console.log('[NGDC] Adding html for widgettype: ', scope.widgettype);
                 if (newValue) {
                 build(newValue);
                 }
                 });*/

                // $compile(elem)(scope);
            }
        };
    }]);


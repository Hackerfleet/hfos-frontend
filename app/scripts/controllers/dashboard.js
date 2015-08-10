'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('DashboardCtrl', function ($scope, navdata, decksterService, socket, createDialog) {


        socket.send({'type': 'info', 'content': 'Dashboard activated'});

        $scope.deckOptions = {
            id: 'Dashboard',
            gridsterOpts: { // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
                columns: 5,
                rowHeight: 150,
                margins: [10, 10]
            }
        };

        $scope.analogvalue = 0;
        $scope.digitalvalue = 'GPS_LatLon';
        $scope.course = 0;


        $scope.cards = []
        /*
         {
         title: 'Bearing Readout',
         id: 'bearing',
         size: {x: 2, y: 3},
         position: [0, 0],
         value: $scope.course,
         summaryTemplateUrl: 'views/cards/courseSummaryTemplate.html',
         detailTemplateUrl: 'views/cards/courseDetailsTemplate.html' // Required for popout feature to work

         },
         {
         title: 'Gauge Readout',
         id: 'gauge',
         size: {x: 2, y: 2},
         position: [0, 2],
         value: $scope.analogvalue,
         summaryTemplateUrl: 'views/cards/analogReadoutSummaryTemplate.html',
         detailTemplateUrl: 'views/cards/analogReadoutDetailsTemplate.html'

         },
         {
         title: 'Digital Readout',
         id: 'digital',
         size: {x: 1, y: 1},
         position: [2, 2],
         value: $scope.digitalvalue,
         summaryTemplateUrl: 'views/cards/digitalReadoutSummaryTemplate.html',
         detailTemplateUrl: 'views/cards/digitalReadoutDetailsTemplate.html'
         }];

         $scope.cardDefaults= {
         'bearing': {
         summaryTemplateUrl: 'views/cards/courseSummaryTemplate.html',
         detailTemplateUrl: 'views/cards/courseDetailsTemplate.html'
         },
         'gauge': {
         summaryTemplateUrl: 'views/cards/analogReadoutSummaryTemplate.html',
         detailTemplateUrl: 'views/cards/analogReadoutDetailsTemplate.html'
         },
         'digital': {
         summaryTemplateUrl: 'views/cards/digitalReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/digitalReadoutDetailsTemplate.html'
         }
         };

         */
        $scope.configureCards = function () {
            console.log('[DASH] Opening configuration');
            createDialog('/views/modals/dashboardconfig.tpl.html', {
                    id: 'DashboardConfig',
                    title: 'Dashboard configuration',
                    backdrop: false,
                    footerTemplate: '<span></span>'
                }, {'config': 'FOOBAR'} //$scope.cards}
            );
        };

        // Setup the cards for this deck
        decksterService.buildCards('Dashboard', $scope.cards);
    }).controller('DashboardConfigCtrl', function ($scope, navdata, config) {
        $scope.config = config;
        console.log('[DASHBOARDCONFIG] Scope: ', $scope, $scope.config);
    });

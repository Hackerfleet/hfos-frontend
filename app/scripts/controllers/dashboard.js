'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('DashboardCtrl', ['$scope', 'decksterService', 'socket', 'navdata',
        function ($scope, decksterService, socket, navdata) {

            $scope.true_course = 0;
            $scope.spd_over_grnd = 0;

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
            $scope.digitalvalue = 'spd_over_gnd';
            $scope.course = 0;

            $scope.cards = [
                {
                    title: 'Course',
                    id: 'course',
                    size: {x: 2, y: 3},
                    position: [0, 0],
                    course: $scope.course,
                    summaryTemplateUrl: 'views/cards/courseSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/courseDetailsTemplate.html' // Required for popout feature to work

                },
                {
                    title: 'Analog',
                    id: 'analog',
                    size: {x: 2, y: 2},
                    position: [0, 2],
                    value: $scope.analogvalue,
                    summaryTemplateUrl: 'views/cards/analogReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/analogReadoutDetailsTemplate.html'

                },
                {
                    title: 'Digital Example',
                    id: 'digital',
                    size: {x: 1, y: 1},
                    position: [2, 2],
                    value: $scope.digitalvalue,
                    summaryTemplateUrl: 'views/cards/digitalReadoutSummaryTemplate.html',
                    detailTemplateUrl: 'views/cards/digitalReadoutDetailsTemplate.html'
                }];

            // Setup the cards for this deck
            //decksterService.buildCards('testDeck', $scope.cards);
            $scope.value = 1.5;
            $scope.upperLimit = 6;
            $scope.lowerLimit = 0;
            $scope.unit = 'kW';
            $scope.precision = 2;
            $scope.ranges = [
                {
                    min: 0,
                    max: 1.5,
                    color: '#DEDEDE'
                },
                {
                    min: 1.5,
                    max: 2.5,
                    color: '#8DCA2F'
                },
                {
                    min: 2.5,
                    max: 3.5,
                    color: '#FDC702'
                },
                {
                    min: 3.5,
                    max: 4.5,
                    color: '#FF7700'
                },
                {
                    min: 4.5,
                    max: 6.0,
                    color: '#C50200'
                }
            ];
        }]);

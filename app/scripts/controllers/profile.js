'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('ProfileCtrl', function ($scope, $location, schemata, user) {
        console.log('ProfileCtrl loaded!');

        var profile = user.profile();
        $scope.model = profile;
        $scope.schema = schemata.get('profile');
        console.log('[PROFILE] Schema: ', $scope.schema);

        $scope.$on('Profile.Update', function (event) {
            console.log('Profile Controller updating.');
            var profile = user.profile();
            $scope.schema = schemata.get('profile');
            $scope.model = profile;
            console.log('New data: ', $scope.schema, $scope.model);
            $scope.$apply();
            console.log('Profile updated: ', profile);
        });

        $scope.submitForm = function (model) {
            console.log('Profile update initiated.');
            user.updateprofile(model);
        };

        $scope.opentab = function (tabname) {
            console.log('[PROFILE] Switching tab to ', tabname);
            $('.nav-tabs .active, .tab-content .active').removeClass('active');
            $('#' + tabname).addClass('active');
        }

        $scope.tabs = [
            {
                'title': 'User data',
                'content': '<form sf-schema="schema" sf-form="userdataform" sf-model="model" ng-submit="submitForm(model)"></form>'
            },
            {
                'title': 'Settings',
                'content': '<form sf-schema="schema" sf-form="settingsform" sf-model="model" ng-submit="submitForm(model)"></form>'
            }
        ];

        $scope.tabs.activeTab = "User data";

        $scope.settingsform = [
            {
                type: 'section',
                htmlClass: 'row',
                items: [
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'settings.color', 'settings.theme'
                        ]
                    }
                ]
            },
            'settings.notes',
            {
                type: 'submit',
                title: 'Save Settings'
            }
        ];

        $scope.userdataform = [
            {
                type: 'section',
                htmlClass: 'row',
                items: [
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'userdata.name', 'userdata.d-o-b', 'userdata.callsign'
                        ]
                    },
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'userdata.familyname', 'userdata.nick'
                        ]
                    },
                    {
                        type: 'section',
                        htmlClass: 'col-xs-4',
                        items: [
                            'userdata.phone', 'userdata.shift', 'userdata.visa'
                        ]
                    }
                ]
            },
            'userdata.notes',
            {
                type: 'submit',
                title: 'Save Userdata',
            }
        ];
    });

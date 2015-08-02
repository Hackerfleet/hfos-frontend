'use strict';

/**
 * @ngdoc function
 * @name hfosFrontendApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the hfosFrontendApp
 */
angular.module('hfosFrontendApp')
    .controller('ProfileCtrl', function ($scope, $location, schemata, user, ObjectProxy) {
        console.log('[PROFILE] ProfileCtrl loaded!');

        $scope.model = user.profile();
        $scope.schema = schemata.schema('profile');
        $scope.clientconfigform = schemata.form('client');
        $scope.clientconfigschema = schemata.schema('client');
        $scope.clientconfigs = {};
        $scope.clientconfigmodel = {};

        var configedituuid = '';

        ObjectProxy.getlist('client', {'useruuid': user.user().uuid});

        console.log('[PROFILE] Schema: ', $scope.schema);

        $scope.$on('Profile.Update', function (event) {
            console.log('[PROFILE] Profile Controller updating.', event);
            var profile = user.profile();
            $scope.schema = schemata.schema('profile');
            $scope.clientconfigschema = schemata.schema('client');
            $scope.clientconfigform = schemata.form('client');

            $scope.model = profile;
            console.log('[PROFILE] New data: ', $scope.schema, $scope.model);
            $scope.$apply();
            console.log('[PROFILE] Profile updated: ', profile);
        });

        $scope.$on('OP.ListUpdate', function (ev, schema) {
            console.log('[PROFILE] List update:', schema);

            if (schema === 'client') {
                console.log('[PROFILE] Clientconfig list updating');
                $scope.clientconfigs = ObjectProxy.lists['client'];
                $scope.$apply();
            }
        });

        $scope.$on('OP.Change', function (ev, uuid) {
            console.log('[PROFILE] Clientconfig update:', uuid);

            if (uuid === configedituuid) {
                console.log('[PROFILE] Clientconfig list updating');
                $scope.clientconfigmodel = ObjectProxy.obj[uuid];
                $scope.$apply();
            }
        });


        $scope.submitForm = function (model) {
            console.log('[PROFILE] Profile update initiated.');
            user.updateprofile(model);
        };

        $scope.opentab = function (tabname) {
            console.log('[PROFILE] Switching tab to ', tabname);
            $('.nav-pills .active, .tab-content .active').removeClass('active');
            $('#' + tabname).addClass('active');
        };

        $scope.openclienttab = function () {
            console.log('[PROFILE] Opening client configuration tab.');

            ObjectProxy.getlist('client', {'useruuid': user.user().uuid});

            $('.nav-pills .active, .tab-content .active').removeClass('active');
            $('#clientconfigs').addClass('active');
        };

        $scope.pickconfig = function (configuuid) {
            console.log('[PROFILE] Picked client config ', configuuid);
            console.log('[PROFILE] Opening client configuration tab.');

            configedituuid = configuuid;

            ObjectProxy.get('client', configuuid);

            $('.nav-pills .active, .tab-content .active').removeClass('active');
            $('#clientconfigs').addClass('active');
        };

        $scope.submitClientForm = function (model) {
            console.log('[PROFILE] Storing client configuration.');
            $scope.clientconfigmodel = model;
            ObjectProxy.put('client', model);
            ObjectProxy.getlist('client', {'useruuid': user.user().uuid}, ['active']);
        };

        $scope.tabs = [
            {
                'title': 'User data',
                'content': '<form sf-schema="schema" sf-form="userdataform" sf-model="model"\ ' +
                'ng-submit="submitForm(model)"></form>'
            },
            {
                'title': 'Settings',
                'content': '<form sf-schema="schema" sf-form="settingsform" sf-model="model"\ ' +
                'ng-submit="submitForm(model)"></form>'
            }
        ];

        $scope.tabs.activeTab = 'User data';

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
                title: 'Save Userdata'
            }
        ];

        $scope.alertconfigform = [
            'alertconfig.active',
            {
                type: 'submit',
                title: 'Save Alert configuration'
            }
        ];

    });

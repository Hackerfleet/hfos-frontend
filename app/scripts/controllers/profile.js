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

      $scope.$on('profileupdate', function(event) {
          console.log('Profile Controller updating.');
          var profile = user.profile();
          $scope.schema = schemata.get('profile');
          $scope.model = profile;
          console.log('New data: ', $scope.schema, $scope.model);
          $scope.$apply();
          console.log('Profile updated: ', profile);
      })

      $scope.submitForm = function (model) {
        console.log('Profile update initiated.');
        user.updateprofile(model);
      }

      $scope.form = [
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
                        'userdata.familyname', 'userdata.nick', 'userdata.color'
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
        'notes',
        {
          type: "submit",
          title: "Save",
        }
      ];
  });

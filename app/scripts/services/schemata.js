'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.schemata
 * @description
 * # schemata
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('schemata', function (user, socket, $rootScope) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        console.log('[SCHEMATA] SchemataService initializing.');

        var schemata = {};

        var registerschemata = function (message) {
            // Schemata reception hook

            var msg = JSON.parse(message.data);

            if (msg.component === 'schema') {
                console.log('[SCHEMATA] Schemata interaction:', msg.action);
                if (msg.action === 'All') {
                    schemata = msg.data;
                    console.log('[SCHEMATA] New schemata received:', schemata);
                    $rootScope.$broadcast('Schemata.Update');
                }
            }
        };

        socket.onMessage(registerschemata);

        var updateschemata = function () {
            // Get Schemata
            console.log('[SCHEMATA] Getting update of schemata.');
            socket.send({'component': 'schema', 'action': 'All'});
        };

        var getschemadata = function (schemaname) {
            console.log('[SCHEMATA] Full schema requested: ', schemaname, schemata[schemaname]);
            return schemata[schemaname];
        };

        var getschema = function (schemaname) {
            console.log('[SCHEMATA] Schema requested: ', schemaname, schemata[schemaname]['schema']);
            if (user.signedin()) {
                return schemata[schemaname]['schema'];
            } else {
                console.log('[SCHEMATA] But we are not logged in!');
            }
        };

        var getform = function (schemaname) {
            console.log('[SCHEMATA] Schema requested: ', schemaname, schemata[schemaname]['form']);
            return schemata[schemaname]['form'];
        };

        user.onAuth(updateschemata);

        if (user.signedin() === true) {
            updateschemata();
        }

        var check = function () {
            console.log('[SCHEMATA]', schemata);
        };

        return {
            form: getform,
            schema: getschema,
            get: getschemadata,
            check: check,
            updateall: updateschemata
        };
    });

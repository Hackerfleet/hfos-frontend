'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.schemata
 * @description
 * # schemata
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
  .service('schemata', function (user, socket) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    console.log('SchemataService initializing.');

    var schemata = {};

    var registerschemata = function(message) {
        var msg = JSON.parse(message.data);

        if(msg.component === 'schema') {
            console.log('Schemata interaction:', msg.action);
            if(msg.action === 'All'){
                console.log('Received all schemata.');
                schemata = msg.data;
            }
        }
    }

    socket.onMessage(registerschemata);

    var updateschemata = function() {
        // Get Schemata
        console.log('Getting update of schemata.');
        socket.send({'component': 'schema', 'action': 'All'});
    }

    var getschema = function(schemaname) {
        console.log('Schema requested: ', schemaname, schemata[schemaname], schemata);
        return schemata[schemaname];
    }

    user.onAuth(updateschemata);
    if(user.signedin() === true) {
        updateschemata();
    }

    return {
        get: getschema,
        updateall: updateschemata
    }
  });

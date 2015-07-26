'use strict';

/**
 * @ngdoc service
 * @name hfosFrontendApp.Wiki
 * @description
 * # Wiki
 * Service in the hfosFrontendApp.
 */
angular.module('hfosFrontendApp')
    .service('Wiki', function (socket, $rootScope) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var wikipages = {};
        var pagelist = [];

        console.log('Wiki service started');
        socket.onMessage(function (message) {
            // Wiki handler
            var msg = JSON.parse(message.data);
            if (msg.component === 'wiki') {
                if (msg.action === 'get') {
                    var pagename = msg.data.name;
                    console.log('Updated wiki page from node: ', pagename);
                    wikipages[pagename] = msg.data;
                    $rootScope.$broadcast('Wiki.Change', pagename);
                } else if (msg.action === 'put') {
                    var result = msg.data[0];
                    var putpagename = msg.data[1];
                    if (result === true) {
                        console.log('[WIKI] Page successfully stored.');
                        $rootScope.$broadcast('Wiki.Stored', putpagename);
                    } else {
                        console.log('[WIKI] Page was not stored correctly: ', putpagename);
                    }
                } else if (msg.action === 'list') {
                    console.log('Updated wiki pagelist from node: ', msg.data);
                    pagelist = msg.data;
                    $rootScope.$broadcast('Wiki.List');
                }
                console.log('Wiki pages: ', wikipages);
            }

        });

        $rootScope.$on('User.Login', function (ev) {
            getPageList();
        });

        var getPage = function (pagename) {
            console.log('Getting wiki page: ', pagename);
            socket.send({'component': 'wiki', 'action': 'get', 'data': pagename});
        };

        var putPage = function (pagename, pagedata) {
            console.log('Putting wiki page: ', pagename);

            // is this necessary? Should've been auto updated from the damn controller
            wikipages[pagename] = pagedata;

            socket.send({'component': 'wiki', 'action': 'put', 'data': pagedata});
        };

        var getPageList = function () {
            console.log('Getting wiki page directory');
            socket.send({'component': 'wiki', 'action': 'list', 'data': ''});
        };

        var getPages = function () {
            console.log('Delivering wiki pages');
            return wikipages;
        };

        return {
            get: getPage,
            put: putPage,
            list: getPageList,
            pages: wikipages,
            getpages: getPages
        };
    });

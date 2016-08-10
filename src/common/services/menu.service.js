/*
 * Hackerfleet Operating System
 * =====================================================================
 * Copyright (C) 2011-2016 riot <riot@hackerfleet.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Created by riot on 20.06.16.
 */
'use strict';

/*
 <li class="dropdown">
 <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
 aria-expanded="false">Client<span class="caret"></span></a>
 <ul class="dropdown-menu" id="clientmenu">
 <li><div id="clientname">N/A</div></li>
 <li role="separator" class="divider"></li>
 <li ng-repeat="config in $ctrl.clientconfiglist">
 <div>
 <a ng-click="$ctrl.switchClientConfig(config.uuid)">{{config.name}}</a>
 <div class="menu-icon-list pull-right">
 <a type="button" ng-click="$ctrl.switchClientConfig(config.uuid)">
 <i class="fa fa-hand-o-right menu-icon-tiny"></i></a>
 <a type="button" ng-click="$ctrl.deleteClientConfig(config.uuid)">
 <i class="fa fa-remove menu-icon-tiny"></i></a>
 <a type="button" ng-click="$ctrl.editClientConfig(config.uuid)">
 <i class="fa fa-pencil menu-icon-tiny"></i></a>
 </div>
 </div>
 </li>
 </ul>
 </li>
 */
class MenuService {

    /*@ngInject*/
    constructor($rootScope, $state) {
        console.log('MenuService constructing');
        this.rootscope = $rootScope;
        this.state = $state;

        this.menus = [];

        var self = this;

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
                console.log('Deleting menus');
                for (var item of self.menus) {
                    $('#menu' + item).remove();
                }
                self.menus = [];
            });

        console.log('MenuService constructed');

        /*
        var foofunc = function () {
            console.log('FooFunc has been called!');
        };

        var testmenu = [
            {type: 'label', text: 'LabelText'},
            {type: 'divider'},
            {type: 'func', name: 'foofunc', text: 'Function', callback: foofunc, args: ""}
        ];

        this.addMenu('TestMenu', testmenu);
        */
    }

    addMenu(title, menu) {
        if (title in this.menus) {
            console.log('Replacing menu:', title);
            $('#'+title).remove();
        } else {
            this.menus.push(title);
        }

        var html = '<li class="dropdown" id="menu' + title + '">' +
            '<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"' +
            'aria-expanded="false">' + title + '<span class="caret"></span></a>' +
            '<ul class="dropdown-menu componentmenu" id="' + title + 'menu">';

        for (var item of menu) {
            switch (item.type) {
                case 'divider':
                    html = html + '<li role="separator" class="divider"></li>';
                    break;
                case 'label':
                    html = html + '<li><div class="menuitem">' + item.text + '</div>';
                    break;
                case 'func':
                    html = html + '<li><div><a class="menuitem" id="menuitem' + item.name + '">' + item.text + '</a></div></li>';
                    break;
                case 'check':
                    html = html + '<li><div class="menuitem"><input type="checkbox" id="menuitem' + item.name + '">' + item.text + '</input></div></li>';
            }
        }

        $('#mainmenunavbar').append(html);

        var funcs = menu.filter(function (d) {
            return d.type === 'func' || d.type === 'check';
        });

        for (var func of funcs) {
            if (func.type === 'func') {
                $('#menuitem' + func.name).attr('args', func.args).click(function () {
                    func.callback($(this).attr('args'));
                });
            } else if (func.type === 'check') {
                $('#menuitem' + func.name).attr('args', func.args).change(function () {
                    func.callback($(this).prop('checked'), $(this).attr('args'));
                });
            }
        }
    }
}

MenuService.$inject = ['$rootScope', '$state'];

export default MenuService;

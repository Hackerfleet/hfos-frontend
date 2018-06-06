/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2018 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
function requireAll(r) {
    r.keys().forEach(r);
    return r;
}

let backgrounds = null; //requireAll(require.context("../../../assets/images/backgrounds", true, /^(.*\.(jpg$))[^.]*$/igm));
let themes = null; //requireAll(require.context("../../themes", true, /\.scss$/));

class AppComponent {

    constructor(scope, user, socket, rootscope, objectproxy, state, notification, infoscreen, statusbar, systemconfig) {
        this.scope = scope;
        this.user = user;
        this.socket = socket;
        this.rootscope = rootscope;
        this.objectproxy = objectproxy;
        this.state = state;
        this.notification = notification;
        this.infoscreen = infoscreen;
        this.statusbar = statusbar;
        this.systemconfig = systemconfig;

        this.rotationenabled = infoscreen.enabled;
        this.rotationpaused = false;

        this.search_string = '';
        this.search_collapsed = true;

        this.clientconfiglist = [];

        console.log('[APP] Backgrounds:', backgrounds);
        console.log('[APP] Themes:', themes);

        for (let theme in themes) {
            console.log('[APP] Theme:', theme, theme.id, theme.resolve, theme.keys);
        }

        let self = this;

        // TODO: Move to infoscreen service
        this.rotationpause = function () {
            this.rotationpaused = !this.rotationpaused;
            this.infoscreen.toggleRotations(!this.rotationpaused);
        };

        // TODO: Move to infoscreen service
        this.rootscope.$on('Clientconfig.Update', function () {
            self.rotationenabled = self.infoscreen.enabled;
            console.log('Updating rotation to: ', self.rotationenabled);
        });

        this.rootscope.$on('Profile.Update', function () {
            // Set a nice background, if one is configured
            let background = self.user.profile.settings.background;
            //console.log("BG:", background, backgrounds);
            if (background === "") {
                return;
            } else if (background !== 'default') {
                console.log('url(/assets/images/backgrounds/' + background + ')');
                $('body').css({
                    'background': 'url(/assets/images/backgrounds/' + background + ') no-repeat center center fixed',
                    'background-size': 'cover'
                });
            } else if (background === 'none') {
                $('body').css({
                    'background': 'none'
                });
            }
        });

        this.update_client_configurations = function () {
            console.log('[APP] Populating client menu.');
            // Request client list for the client menu
            self.objectproxy.search('client', {'owner': self.user.useruuid}).then(function (msg) {
                console.log('[APP] Clientconfiglist: ', msg);
                self.clientconfiglist = msg.data.list;
            });
        };

        this.user.onAuth(function () {
            self.update_client_configurations();
            // TODO: Move this (and the corresponding code in FeatureMenu) to a central service
            let menu = $('#modulemenu');
            let menu_dict = {};

            menu.empty();

            for (let state of self.state.get()) {
                if (typeof state.roles !== 'undefined') {
                    let found = false;
                    for (let role of state.roles) {
                        for (let check_role of self.user.account.roles) {
                            if (check_role === role) {
                                found = true;
                            }
                        }
                    }
                    if (found === false) {
                        continue;
                    }
                }
                if ('icon' in state) {
                    let menuentry = '<li><div><a href="#!' + state.url + '"><img class="module-icon-tiny" src="' + state.icon + '" type="image/svg+xml">' + state.label + '</a></div></li>';
                    menu_dict[state.label] = menuentry;
                }
            }

            let labels = Object.keys(menu_dict);
            labels.sort();

            for (let label of labels) {
                menu.append(menu_dict[label]);
            }
        });

        $('#bootscreen').hide();
        $(document).on('click', '.navbar-collapse.in', function (e) {
            if ($(e.target).is('a')) {
                $(this).collapse('hide');
            }
        });
    }

    userbutton() {
        this.user.login();
    }

    switchClientConfig(uuid) {
        this.user.switchClientconfig(uuid);
    }

    editClientConfig(uuid) {
        this.state.go('app.editor', {schema: 'client', action: 'edit', 'uuid': uuid});
    }

    deleteClientConfig(uuid) {
        this.objectproxy.deleteObject('client', uuid);
    }

    home(event) {
        if (event.shiftKey === true) {
            console.log('[MAIN] Reloading route.');
            // TODO: Reimplement this
            this.socket.check();
        } else if (event.ctrlKey === true) {
            console.log('[MAIN] Disconnecting');
            //socket.disconnect();
        }
        /*socket.check();
         user.check();
         schemata.check();*/
        console.log('[MAIN] Main profile: ', this.user.profile);
    }

    search(event) {
        if (this.search_string !== '') {
            console.log('Would search now');
        } else {
            this.search_collapsed = !this.search_collapsed;
        }
    }

}

AppComponent.$inject = ['$scope', 'user', 'socket', '$rootScope', 'objectproxy', '$state', 'notification', 'infoscreen', 'statusbar', 'systemconfig'];

export default AppComponent;

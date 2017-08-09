/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2017 riot <riot@c-base.org> and others.
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

let backgrounds = require.context("../../../assets/images/backgrounds", true, /^(.*\.(jpg$))[^.]*$/igm);

class AppComponent {
    
    constructor(scope, user, socket, rootscope, objectproxy, state, alert, fullscreen, infoscreen) {
        this.scope = scope;
        this.user = user;
        this.socket = socket;
        this.rootscope = rootscope;
        this.objectproxy = objectproxy;
        this.state = state;
        this.alert = alert;
        this.fullscreen = fullscreen;
        this.infoscreen = infoscreen;
        
        this.rotationenabled = infoscreen.enabled;
        this.rotationpaused = false;
        
        this.clientconfiglist = [];
        
        let self = this;
        
        this.rotationpause = function () {
            this.rotationpaused = !this.rotationpaused;
            this.infoscreen.toggleRotations(!this.rotationpaused);
        };
        
        this.rootscope.$on('Clientconfig.Update', function () {
            self.rotationenabled = self.infoscreen.enabled;
            console.log('Updating rotation to: ', self.rotationenabled);
        });
        
        this.rootscope.$on('Profile.Update', function () {
            // Set a nice background, if one is configured
            let background = self.user.profile.settings.background;
            console.log("BG:", background, backgrounds);
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
        
        this.update_client_configurations = function() {
            console.log('[APP] Populating client menu.');
            // Request client list for the client menu
            self.objectproxy.searchItems('client', {'owner': self.user.useruuid}).then(function (msg) {
                console.log('[APP] Clientconfiglist: ', msg);
                self.clientconfiglist = msg.data;
            });
        };
        
        this.user.onAuth(function () {
            self.update_client_configurations();
            let menu = $('#modulemenu');
            
            menu.empty();
            
            for (let state of self.state.get()) {
                if ('icon' in state) {
                    
                    let menuentry = '<li><div><a href="#!' + state.url + '"><img class="module-icon-tiny" src="' + state.icon + '" type="image/svg+xml">' + state.label + '</a></div></li>';
                    menu.append(menuentry);
                }
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
    
    chattoggle() {
    
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
    
    fullscreentoggle() {
        if (this.fullscreen.isEnabled()) {
            this.fullscreen.cancel();
            $('#mainmenu').collapse('show');
            $('#spanfullscreen').addClass('fa-expand')
                .removeClass('fa-compress');
        }
        else {
            this.fullscreen.all();
            $('#mainmenu').collapse('hide');
            $('#spanfullscreen').removeClass('fa-expand')
                .addClass('fa-compress');
        }
    }
    
    mainmenutoggle() {
        if ($('#fullscreengrab').css('top') === '42px') {
            $('#fullscreengrab').animate().css({top: '-8px'});
            $('#mainmenu').fadeOut(50);
            $('#content').css({'padding-top': '0px'});
            $('#fullscreengrabicon').removeClass('fa-arrow-up').addClass('fa-arrow-down');
        } else {
            $('#fullscreengrab').animate().css({top: '42px'});
            $('#mainmenu').fadeIn(50);
            $('#content').css({'padding-top': '50px'});
            $('#fullscreengrabicon').removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
    }
    
    mobbutton() {
        console.log('[MAIN] MOB Button pressed');
        this.alert.mobTrigger();
    }
}

AppComponent.$inject = ['$scope', 'user', 'socket', '$rootScope', 'objectproxy', '$state', 'alert', 'Fullscreen', 'infoscreen'];

export default AppComponent;

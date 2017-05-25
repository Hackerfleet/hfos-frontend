var backgrounds = require.context("../../../assets/images/backgrounds", true, /^(.*\.(jpg$))[^.]*$/igm);

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
        
        var self = this;

        function updateclientconfigurations(ev, schema, uuid) {
            console.log('LIST UPDATED:', ev, uuid, schema);
            if (schema === 'client') {
                console.log('[APP] ListUpdate: ', ev);
                self.clientconfiglist = self.objectproxy.list(schema);
                console.log('[APP] New client config list:', self.clientconfiglist);
            }
        }
        
        this.rotationpause = function() {
            this.rotationpaused = !this.rotationpaused;
            this.infoscreen.toggleRotations(!this.rotationpaused);
        };
        
        this.rootscope.$on('Clientconfig.Update', function() {
           self.rotationenabled = self.infoscreen.enabled;
           console.log('Updating rotation to: ', self.rotationenabled);
        });
        
        this.rootscope.$on('OP.ListUpdate', updateclientconfigurations);
        this.rootscope.$on('OP.Deleted', updateclientconfigurations);

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

        this.user.onAuth(function () {
            console.log('[APP] Populating client menu.');
            // Request client list for the client menu
            self.objectproxy.getList('client', {'owner': self.user.useruuid});

            var menu = $('#modulemenu');

            menu.empty();

            for (var state of self.state.get()) {
                if ('icon' in state) {

                    var menuentry = '<li><div><a href="#!' + state.url + '"><img class="module-icon-tiny" src="' + state.icon + '" type="image/svg+xml">' + state.label + '</a></div></li>';
                    menu.append(menuentry);
                }
            }
        });

        $('#bootscreen').hide();
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
        this.objectproxy.delObject('client', uuid);
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

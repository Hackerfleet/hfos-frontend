export default class featureMenu {

    constructor() {
        this.signedin = false;
        console.log('Hey dude!');
        // TODO: Move this to the client configuration as server supplied module list or something
        this.items = [
            {
                title: 'Map',
                url: 'map',
                svg: 'iconmonstr-map-2-icon.svg',
                row: 0,
                col: 0
            },
            {
                title: 'Switchboard',
                url: 'switchboard',
                svg: 'iconmonstr-control-panel-icon.svg',
                row: 0,
                col: 1
            },
            {
                title: 'Communication',
                url: 'communication',
                svg: 'iconmonstr-radio-tower-icon.svg',
                row: 0,
                col: 2
            },
            {
                title: 'Wiki',
                url: 'wiki/Index',
                svg: 'iconmonstr-note-21-icon.svg',
                row: 0,
                col: 3
            },
            {
                title: 'Weather',
                url: 'weather',
                svg: 'iconmonstrandhackerfleet-weather-icon.svg',
                row: 1,
                col: 0
            },
            {
                title: 'Logbook',
                url: 'logbook',
                svg: 'iconmonstr-printer-icon.svg',
                row: 1,
                col: 1
            },
            {
                title: 'Dashboard',
                url: 'dashboard',
                svg: 'iconmonstr-compass-6-icon.svg',
                row: 1,
                col: 2
            },
            {
                title: 'Settings',
                url: 'settings',
                svg: 'iconmonstr-wrench-4-icon.svg',
                row: 1,
                col: 3
            }, {
                title: 'Remote Control',
                url: 'gamepadremote',
                svg: 'iconmonstr-gamepad-2-icon.svg',
                row: 2,
                col: 0
            }, {
                title: 'Library',
                url: 'library',
                svg: 'iconmonstr-mediamashup-icon.svg',
                row: 2,
                col: 1
            }, {
                title: 'Tasks',
                url: 'tasks',
                svg: 'iconmonstr-clipboard-4-icon.svg',
                row: 2,
                col: 2

            }
        ];


        this.gridsterOptions = {
            // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
            columns: screen.width / 150,
            rowHeight: 150,
            colWidth: 150,

            margins: [5, 5]
        };

        $('#bootscreen').hide();
    }

    increment() {
        this.counter++;
    }

    home(event) {
        if (event.shiftKey === true) {
            console.log('[MAIN] Reloading route.');
            $route.reload();
        } else if (event.ctrlKey === true) {
            console.log('[MAIN] Disconnecting');
            //socket.disconnect();
        }
        /*socket.check();
         user.check();
         schemata.check();*/
        console.log('[MAIN] Main profile: ', user.profile());
    }

    userbutton(event) {
        console.log('[MAIN] USERBUTTON: ', event);
        //user.login();
        //user.onAuth(loginModal.hide);
    }

    mobbutton() {
        console.log('[MAIN] MOB Button pressed');
        // Alert.mobTrigger();
    }
}

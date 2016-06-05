class featureMenu {

    constructor(userservice, $state, $log) {
        this.signedin = false;
        this.state = $state;
        this.user = userservice;
        $log.log('Featuremenu initializing with Profile: ', userservice.profile);
        console.log(userservice.profile);

        var row=0, col=0;

        this.items = [];

        var menu = $('#modulemenu');

        menu.empty();

        for (var state of this.state.get()) {
            if ('icon' in state) {
                var item = {
                    title: state.label,
                    url: state.url,
                    svg: state.icon,
                    row: 0,
                    col: 0,
                    size: 1
                };

                try {
                    console.log(userservice.profile.settings.menu, state.label);
                    var configentry = userservice.profile.settings.menu.find(x => x.title === state.label);
                    item.row = configentry.row;
                    item.col = configentry.col;
                    item.size = configentry.size;
                } catch (e) {
                    console.log("Oh, no menu config: ", e, state.label);
                    item.row = row;
                    item.col = col;
                    item.size = 1;

                    row++;
                    if (row === 5) {
                        row = 0;
                        col++;
                    }
                }

                var menuentry = '<li><a href="#' + item.url + '"><img class="module-icon-tiny" src="' + item.svg + '" type="image/svg+xml">' + item.title + '</a></li>';
                menu.append(menuentry);

                this.items.push(item);
            }
        }


        function storeMenuConfig(event, el, widget) {
            console.log('Pushing profile.', event, el, widget);
        }

        this.gridsterOptions = {
            // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
            columns: screen.width / 50,
            rowHeight: 50,
            colWidth: 50,
            draggable: {
                start: function(event, el, w) {
                    console.log('FOOBAR');
                },
                stop: storeMenuConfig
            },

            margins: [5, 5]
        };

        $('#bootscreen').hide();


        // TODO: Kept for reference until all icons are moved to their respecting packages:
        /*this.items = [
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
                title: 'Tasks',
                url: 'tasks',
                svg: 'iconmonstr-clipboard-4-icon.svg',
                row: 2,
                col: 2

            }
        ];*/
    }
}


featureMenu.$inject = ['user', '$state', '$log'];

export default featureMenu;

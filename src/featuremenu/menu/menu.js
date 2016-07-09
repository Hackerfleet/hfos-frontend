class featureMenu {

    constructor(userservice, $state, $log, $scope, alert) {
        this.signedin = false;
        this.state = $state;
        this.user = userservice;
        this.scope = $scope;
        this.alert = alert;
        $log.log('Featuremenu initializing with Profile: ', userservice.profile);
        console.log(userservice.profile);


        function storeMenuConfig(event, el, widget) {
            console.log('Pushing profile.', event, el, widget);
        }

        this.gridsterOptions = {
            // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
            columns: screen.width / 50,
            rowHeight: 50,
            colWidth: 50,
            draggable: {
                start: function (event, el, w) {
                    console.log('FOOBAR');
                },
                stop: storeMenuConfig
            },

            margins: [5, 5]
        };

        var self = this;

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



        this.updateMenu = function() {
            console.log('Updating featuremenus');
            var row = 0, col = 0;

            self.items = [];

            var menu = $('#modulemenu');

            menu.empty();


            // TODO: Move these two into the user service. Actually, stuff should be available per default.
            if (typeof self.user.profile.settings === 'undefined') {
                self.user.profile.settings = {};
            }

            if (typeof self.user.profile.settings.menu === 'undefined') {
                self.user.profile.settings.menu = [];
            }

            for (var state of self.state.get()) {
                var enabled = [];
                var profile = self.user.profile;

                if (typeof profile.components !== 'undefined') {
                    enabled = profile.components.enabled;
                }

                if ('icon' in state && true) { // (state.label === 'Map' || state.label in enabled)) {
                    var item = {
                        title: state.label,
                        url: state.url,
                        svg: state.icon,
                        row: 0,
                        col: 0,
                        size: 1
                    };

                    try {
                        console.log(profile.settings.menu, state.label);
                        var configentry = profile.settings.menu.find(x => x.title === state.label);
                        item.row = configentry.row;
                        item.col = configentry.col;
                        item.size = configentry.size;
                    } catch (e) {
                        console.log("Oh, no menu config: ", e, state.label);
                        item.row = row;
                        item.col = col;
                        item.size = 1;

                        if (typeof profile.components !== 'undefined') {
                            profile.settings.menu.push({
                                title: item.title,
                                col: item.col,
                                row: item.row
                            });

                            //self.user.storeprofile();
                        }

                        col++;
                        if (col === 5) {
                            col = 0;
                            row++;
                        }
                    }

                    var menuentry = '<li><a href="#' + item.url + '"><img class="module-icon-tiny" src="' + item.svg + '" type="image/svg+xml">' + item.title + '</a></li>';
                    menu.append(menuentry);

                    self.items.push(item);
                } else {
                    console.log('Item has either no icon or is disabled:', state);
                }
            }

            if (self.items.length === 0) {
                // TODO: Add link to docs, that explains how to do that.
                this.alert.add('warning', 'No modules', 'The menu is empty. A probable reason could be that you have no modules installed.');
            }
        };

        this.updateMenu();
        this.scope.$on('Profile.Update', self.updateMenu);
    }
}


featureMenu.$inject = ['user', '$state', '$log', '$scope', 'alert'];

export default featureMenu;

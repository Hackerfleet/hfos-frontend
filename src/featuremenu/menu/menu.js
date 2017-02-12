class featureMenu {
    
    constructor(userservice, $state, $log, $scope, $timeout, alert) {
        this.signedin = false;
        this.state = $state;
        this.user = userservice;
        this.scope = $scope;
        this.alert = alert;
        this.changetimeout = null;
        
        $log.log('[MENU] Featuremenu initializing with Profile: ', userservice.profile);
        console.log(userservice.profile);
        
        var self = this;
        
        this.storeMenuConfig = function () {
            if ('settings' in self.user.profile) {
                console.log('[MENU] Updating menu list for profile:', self.items);
                
                var menu = [];
                
                for (var item of self.items) {
                    menu.push({
                        title: item.title,
                        row: item.row,
                        col: item.col,
                        size: item.size
                    })
                }
                console.log('[MENU] Pushing menu to profile:', menu);
                self.user.profile.settings.menu = menu;
                self.user.saveProfile();
            }
            
            self.changetimeout = null;
        };
        
        $scope.$watch('$ctrl.items', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                if (self.changetimeout !== null) {
                    $timeout.cancel(self.changetimeout);
                }
                self.changetimeout = $timeout(self.storeMenuConfig, 2000);
            }
        }, true);
        
        this.gridsterOptions = {
            // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
            columns: screen.width / 50,
            rowHeight: 50,
            colWidth: 50,
            defaultSizeX: 5,
            defaultSizeY: 5,
            margins: [5, 5],
            mobileBreakPoint: 600
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
        
        
        this.updateMenu = function () {
            console.log('[MENU] Updating featuremenus');
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
            
            console.log('[MENU] Settings:', self.user.profile.settings.menu);
            
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
                        console.log("[MENU] Attempt:", profile.settings.menu, state.label);
                        console.log(profile.settings.menu[0].title, state.label);
                        var configentry = profile.settings.menu.find(x => x.title === state.label);
                        console.log("Trying to parse ", configentry);
                        item.row = configentry.row;
                        item.col = configentry.col;
                        item.size = configentry.size;
                    } catch (e) {
                        console.log("[MENU] No menu config: ", e, state.label);
                        item.row = row;
                        item.col = col;
                        item.size = 1;
                        
                        if (typeof profile.components !== 'undefined') {
                            var entry = {
                                title: item.title,
                                col: item.col,
                                row: item.row,
                                size: item.size
                            };
                            console.log('[MENU] Pushing to menu config: ', entry);
                            profile.settings.menu.push(entry);
                            
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
                    console.log('[MENU] Item has either no icon or is disabled:', state);
                }
            }
            
            if (self.items.length === 0) {
                // TODO: Add link to docs, that explains how to do that.
                this.alert.add('warning', 'No modules', 'The menu is empty. A probable reason could be that you have no modules installed.');
            }
            
            console.log('[MENU] Menudata:', self.items, self.user.profile.settings.menu);
        };
        
        if (typeof this.user.profile.settings !== 'undefined') {
            if (typeof this.user.profile.settings.menu !== 'undefined') {
                this.updateMenu();
            }
        }
        this.scope.$on('Profile.Update', self.updateMenu);
    }
}


featureMenu.$inject = ['user', '$state', '$log', '$scope', '$timeout', 'alert'];

export default featureMenu;

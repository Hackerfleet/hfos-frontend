class featureMenu {
    
    constructor(userservice, $state, $log, $scope, $timeout, alert) {
        this.signedin = false;
        this.state = $state;
        this.user = userservice;
        this.scope = $scope;
        this.timeout = $timeout;
        this.alert = alert;
        
        this.changetimeout = null;
        this.gridChangeWatcher = null;
        
        this.lockState = false;
        
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
        }
              
        this.gridsterOptions = {
            // any options that you can set for angular-gridster (see:  http://manifestwebdesign.github.io/angular-gridster/)
            columns: screen.width / 70,
            rowHeight: 70,
            colWidth: 70,
            defaultSizeX: 5,
            defaultSizeY: 5,
            margins: [5, 5],
            mobileBreakPoint: 400,
            draggable: {
                enabled: false
            },
            resizable: {
                enabled: false
            }
        };
        
        
        $('#bootscreen').hide();
    
        this.handleGridChange = function (newVal, oldVal) {
            if (newVal === oldVal) {
                console.log('No actual change');
                return;
            }
            if (self.changetimeout !== null) {
                self.timeout.cancel(self.changetimeout);
            }
            self.changetimeout = self.timeout(self.storeMenuConfig, 2000);
        };
        
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
    
    toggleLock() {
        this.lockState = !this.lockState;
        this.gridsterOptions.draggable.enabled = this.lockState;
        this.gridsterOptions.resizable.enabled = this.lockState;
        if (this.lockState) {
            console.log('Enabling gridwatcher');
            this.gridChangeWatcher = this.scope.$watch('$ctrl.items', this.handleGridChange, true);
        } else {
            this.gridChangeWatcher();
        }
    }
}


featureMenu.$inject = ['user', '$state', '$log', '$scope', '$timeout', 'alert'];

export default featureMenu;

var showAngularStats = require('ng-stats');
//showAngularStats();

class AboutComponent {
    
    constructor(rootscope, user, socket, $interval, alert, modal, schemaservice, op, state, localStorageService) {
        this.rootscope = rootscope;
        this.user = user;
        this.socket = socket;
        this.alert = alert;
        this.modal = modal;
        this.$interval = $interval;
        this.state = state;
        this.schemaservice = schemaservice;
        this.storage = localStorageService;
        
        this.schemata = [];
        this.debug = false;
        this.updater = false;
        this.stats = {};
        
        this.serverport = socket.port;
        this.ssloverride = socket.protocol === 'wss';
        
        this.consoleinput = '';
        
        $('#path').css({fill: '#afafff'});
        
        this.testOptions = {
            max: 10,
            min: 1,
            step: 1,
            value: 5
        };
        this.sliderValue = 5;
        this.colorValue = "";
        
        var self = this;
        
        function updateSchemata() {
            self.schemata = [];
            
            for (var schema in self.schemaservice.schemata) {
                if (self.schemaservice.schemata.hasOwnProperty(schema)) {
                    self.schemata.push(schema);
                }
            }
            console.log(self.schemata);
        }
        
        this.rootscope.$on('Schemata.Update', updateSchemata);
        
        if (this.user.debug) {
            console.log('[ABOUT] Opening debug tab:', this.user.debug);
            this.toggleDebug();
            this.opentab(this.storage.get('debugTab'));
        }
        
        updateSchemata();
    }
    
    updateStats() {
        //console.log("Update: ", this.socket);
        var stats = this.socket.stats;
        this.stats = {
            rx: stats.rx,
            tx: stats.tx,
            start: stats.start,
            lag: 'N/A'
        };
    }
    
    command(cmd) {
        this.socket.send({
            'component': 'debugger',
            'action': cmd,
            'data': ''
        });
        var msg = 'Sent: ' + cmd;
        
        this.alert.add('info', 'Debugger', msg, 5);
    }
    
    toggleDebug() {
        console.log('[ABOUT] Toggling Debug tools');
        if (this.debug !== true) {
            this.debug = true;
            
            showAngularStats({
                position: 'bottom',
                htmlId: 'ngstats'
                
            });
            this.updateStats();
            this.updater = this.$interval(() => this.updateStats(), 1000);
        } else {
            this.debug = false;
            this.$interval.cancel(this.updater);
            this.updater = false;
        }
        
        this.user.debug = this.debug;
    }
    
    opentab(tabname) {
        console.log('[ABOUT] Switching tab to ', tabname);
        // TODO: De-jquery this (also somewhere else, e.g. dashboard)
        $('.nav-pills .active, .tab-content .active').removeClass('active');
        $('#' + tabname).addClass('active');
        this.storage.set('debugTab', tabname);
    }
    
    viewlist(schema) {
        this.state.go('app.list', {schema: schema});
    }
    
    setserverport() {
        console.log('[ABOUT] Updating server port to ', this.serverport, this.ssloverride);
        this.socket.setPort(this.serverport, this.ssloverride);
    }
    
    changeport(ev) {
        console.log('CHANGE HANDLER CALLED', ev);
        if (this.serverport === 443) {
            this.ssloverride = true;
        }
    }
    
    unsetserverport() {
        console.log('[ABOUT] Removing server port override');
        this.socket.unsetPort();
    }
    
    sendcommand() {
        this.command(this.consoleinput);
    }
    
    memdebug() {
        this.command('memdebug');
    }
    
    graph() {
        this.command('graph');
    }
    
}

AboutComponent.$inject = ['$rootScope', 'user', 'socket', '$interval', 'alert', '$modal', 'schemata', 'objectproxy', '$state', 'localStorageService'];

export default AboutComponent;

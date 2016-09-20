class AboutComponent {

    constructor(rootscope, socket, $interval, alert, modal, schemaservice, op, state) {
        this.rootscope = rootscope;
        this.socket = socket;
        this.alert = alert;
        this.modal = modal;
        this.$interval = $interval;
        this.state = state;
        this.schemaservice = schemaservice;

        this.schemata = [];
        this.updater = false;
        this.stats = {};
        
        this.serverport = socket.port;

        this.consoleinput = '';

        $('#path').css({fill: '#afafff'});
        $('#debug').hide();

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

    enableDebug() {
        console.log('[ABOUT] Toggling Debug tools');
        if (this.updater === false) {
            $('#debugnavigation').show();
            this.updateStats();
            this.updater = this.$interval(() => this.updateStats(), 1000);
        } else {
            $('#debugnavigation').hide();
            this.$interval.cancel(this.updater);
            this.updater = false;
        }
    }
       
    opentab(tabname) {
        console.log('[ABOUT] Switching tab to ', tabname);

        // TODO: De-jquery this
        $('.nav-pills .active, .tab-content .active').removeClass('active');
        $('#' + tabname).addClass('active');
    }

    viewlist(schema) {
        this.state.go('app.list', {schema: schema});
    }
    
    setserverport() {
        console.log('[ABOUT] Updating server port to ', this.serverport);
        this.socket.setPort(this.serverport);
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

AboutComponent.$inject = ['$rootScope', 'socket', '$interval', 'alert', '$modal', 'schemata', 'objectproxy', '$state'];

export default AboutComponent;

class AboutComponent {

    constructor(socket, $interval, alert, modal) {
        this.socket = socket;
        this.alert = alert;
        this.modal = modal;
        this.$interval = $interval;
        this.stats = {};
        this.updater = false;

        this.consoleinput = '';

        console.log("Hello - alert:", this.alert);

        $('#path').css({fill: '#afafff'});
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

        this.alert.add('info', 'Debugger', msg, 500);
    }

    enableDebug() {
        if (this.updater === false) {
            $('#debug').removeClass('hidden');
            this.updateStats();
            this.updater = this.$interval(() => this.updateStats(), 1000);
        } else {
            $('#debug').addClass('hidden');
            this.$interval.cancel(this.updater);
            this.updater = false;
        }
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

AboutComponent.$inject = ['socket', '$interval', 'alert', '$modal'];

export default AboutComponent;

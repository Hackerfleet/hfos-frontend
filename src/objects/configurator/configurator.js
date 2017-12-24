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

let tv4 = require('tv4');

class configurator {

    constructor($scope, $stateParams, user, socket, schemata, $rootscope, notification, state) {
        this.socket = socket;
        this.stateparams = $stateParams;
        this.schemata = schemata;
        this.rootscope = $rootscope;
        this.notification = notification;
        this.state = state;
        this.scope = $scope;

        this.modified = false;
        this.success = null;
        this.components = null;
        this.changewatcher = null;
        this.configschemata = [];

        this.debug = false;

        this.editorOptions = {
            language: 'en',
            uiColor: '#000000'
        };

        let self = this;

        this.scope.$on('$destroy', function () {
            console.log('[C] Destroying live edit watcher');
            self.loginupdate();
            self.schemaupdate();
            self.socket.unlisten('hfos.ui.configurator', self.configuratorupdate);
            if (self.changewatcher !== null) self.changewatcher();
        });

        function getData() {
            console.log('[C] Getting config ');
            self.schemata.updateconfigschemata();
            self.socket.send({
                component: 'hfos.ui.configurator',
                action: 'getlist'
            });
        }

        this.loginupdate = this.rootscope.$on('User.Login', function () {
            console.log('[C] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            getData();
        });

        this.configuratorupdate = function (msg) {
            console.log('[C] Receiving configurator data:');
            if (msg.action === 'error' && msg.data === 'permission error') {
                self.notification.add('danger', 'No permission', 'You do not have administrative privileges necessary to reconfigure components.', 5);
                self.components = {}; // Deactivate spinner
                return
            }

            if (msg.action === 'getlist') {
                self.components = msg.data;
                console.log('Components:', self.components);
            } else if (msg.action === 'get') {
                console.log('[C] Receiving component configuration:', msg.data, self.configschemadata);
                let editordata = self.configschemadata[msg.data.componentclass];
                self.model = msg.data;
                self.form = editordata['form'];
                self.schema = editordata['schema'];

                if (self.changewatcher !== null) {
                    self.changewatcher();
                }
                self.changewatcher = self.scope.$watch(
                    function () {
                        return self.model;
                    },
                    function (newVal, oldVal) {
                        console.log(newVal, oldVal);
                        if (newVal !== oldVal) self.modified = true;
                    }, true);

                self.modified = false;
                self.stored = null;
            } else if (msg.action === 'put') {
                if (msg.data) {
                    self.notification.add('success', 'Stored', 'Component configuration stored', 3);
                    self.stored = true;
                    self.modified = false;
                } else {
                    self.notification.add('danger', 'Not stored', 'Component configuration could not be stored', 5);
                    self.stored = false;
                }
            }
        };

        this.socket.listen('hfos.ui.configurator', this.configuratorupdate);

            this.schemaupdate = this.rootscope.$on('Schemata.ConfigUpdate', function () {
            console.log('[C] Configuration Schema update.');
            self.configschemadata = self.schemata.configschemata;
            self.configschemata = Object.keys(self.configschemadata);
            console.log(self.configschemadata);
        });

        if (user.signedin) {
            getData();
        }

        this.getFormData = function (options, search) {
            console.log('[C] Trying to obtain proxy list.', options, search);
            if (search === '') {
                console.log("INSIDEMODEL:", options.scope.insidemodel);
            }
            let result = self.objectproxy.searchItems(options.type, search);
            console.log(result);
            return result;
        };

    }

    showConfig(uuid) {
        console.log('UUID:', uuid);

        this.modified = false;
        this.stored = null;
        this.model = this.form = this.schema = null;

        if (this.changewatcher != null) this.changewatcher();

        this.socket.send({
            component: 'hfos.ui.configurator',
            data: {uuid: uuid},
            action: 'get'
        })
    }

    fieldChange(model, form) {
        console.log('Fieldchange called! ', model, form);
        this.modified = true;
    }

    submitForm() {
        let model = this.model;

        console.log('[C] Component config update initiated with ', model);
        this.socket.send({
            component: 'hfos.ui.configurator',
            action: 'put',
            data: this.model
        });
    }

}

configurator.$inject = ['$scope', '$stateParams', 'user', 'socket', 'schemata', '$rootScope', 'notification', '$state'];

export default configurator;

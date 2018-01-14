/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2018 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let tv4 = require('tv4');

class objecteditor {

    constructor($scope, $stateParams, objectproxy, user, socket, schemata, $rootscope, notification, state) {
        this.socket = socket;
        this.schemata = schemata;
        this.rootscope = $rootscope;
        this.notification = notification;
        this.state = state;
        this.user = user;
        this.objectproxy = objectproxy;
        this.scope = $scope;
        $scope.stateParams = $stateParams;

        console.log('[OE] STATEPARAMS: ', $stateParams);
        console.log('[OE] SCOPE: ', $scope);

        this.schemadata = {};
        this.model = {};
        this.initial = {};

        this.debug = false;

        this.live = false;
        this.livewatcher = null;

        this.history = false;

        this.editorOptions = {
            language: 'en',
            uiColor: '#000000'
        };

        // TODO: Clean up the editor api, this is a bit messy from the directive movement
        // Same goes for the list, probably.

        let self = this;

        this.scope.$on('Changed.UUID', function(event, val) {
            console.log('[OE] UUID changed:', self.uuid);
            self.config.uuid = val;
            self.getData();
        });

        this.scope.$on('Changed.Initial', function(event, val) {
            console.log('[OE] Initial model changed:', val);
            self.model = val;
        });


        this.toggleLive = function () {
            console.log('Toggling live watcher', this.live, this.livewatcher);
            if (this.live === false) {
                console.log('Now off');
                this.livewatcher();
            } else {
                console.log('Now on');
                this.history = true;
                this.toggleHistory();
                this.livewatcher = $scope.$watch(
                    function () {
                        return self.model
                    },
                    function (oldvar, newvar) {
                        console.log('MODEL HAS BEEN CHANGED:', oldvar, newvar);
                        console.log(self.schemadata.form);
                        let result = tv4.validateResult(self.model, self.schemadata.schema);
                        console.log('RESULT:', result);
                        if (result.valid === true) {
                            console.log('Form is valid, transmitting.');
                            self.submitObjectChange();
                        } else {
                            $('#statusCenter').html(result.message + ': ' + result.configpath);
                            console.log('Invalid form, cannot submit.');
                        }
                    },
                    true
                );
            }
        };

        this.toggleHistory = function () {
            console.log('Toggling history', this.history);
            if (this.history === false) {
                if (this.live === true) {
                    this.notification.add('danger', 'Editor', 'Cannot deactivate History when live editing.', 3);
                    this.history = true;
                    return
                }
                console.log('History now off');
            } else {
                console.log('History now on');
            }
        };

        this.scope.$on('$destroy', function () {
            console.log('[OE] Destroying live edit watcher');
            if (self.livewatcher !== null) self.livewatcher();
            self.schemaupdate();
            self.loginupdate();
            self.objupdate();
            self.getupdate();
            self.putupdate();
        });

        this.markStored = function () {
            console.log('[OE] Marking object as stored.');
            $('#objStored').removeClass('hidden');
            $('#objModified').addClass('hidden');
            self.config.action = 'Edit';
            self.notification.add('success', 'Editor', 'Object successfully stored.', 5);
        };

        this.putupdate = this.rootscope.$on('OP.Put', function (ev, uuid) {
            if (uuid === self.config.uuid) {
                self.markStored();
            } else if (self.config.uuid === "") {
                // TODO: What if another object is being created right now?
                // We could check if the object body is the same.
                // (Works bad on objects that are somehow modified before saving them)
                self.config.uuid = uuid;
                self.markStored();
            }
        });


        this.getupdate = this.rootscope.$on('OP.Get', function (ev, uuid) {
            self.updateModel(uuid);
        });

        this.objupdate = this.rootscope.$on('OP.Update', function (ev, uuid) {
            self.updateModel(uuid);
        });

        this.loginupdate = this.rootscope.$on('User.Login', function () {
            console.log('[OE] User logged in, getting current page.');
            // TODO: Check if user modified object - offer merging
            self.getData();
        });

        this.schemaupdate = this.rootscope.$on('Schemata.Update', function () {
            console.log('[OE] Schema update.');
            let newschema = self.schemata.schema(self.config.schema);
            console.log('[OE] Got a schema update:', newschema);
            self.schemadata = self.schemata.get(self.config.schema);

            self.getData();
        });

        this.getData = function () {
            console.log('[OE] Getting schema for ', self.config.schema);
            self.schemadata = self.schemata.get(self.config.schema);
            if (self.config.action !== 'Create' && self.config.uuid !== '') {
                console.log('[OE] Requesting object.');
                self.objectproxy.getObject(self.config.schema, self.config.uuid, true);
            }
        };

        this.getFormData = function (options, search) {
            console.log('[OE] Trying to obtain proxy list.', options, search);
            if (search === '') {
                console.log("INSIDEMODEL:", options.scope.insidemodel);
            }
            let result = self.objectproxy.search(options.type, search);
            console.log('[OE] Result: ', result);
            return result.data.list;
        };

        this.updateModel = function (uuid) {
            console.log('[OE] Object has been updated from node, checking..', uuid, self);
            console.log('[OE] Self Scope UUID: ', self.config.uuid);
            console.log('[OE] Object changed, updating content.');
            self.model = _.clone(self.objectproxy.objects[uuid]);
            console.log('[OE] Object model: ', self.model);
            $('#objectModified').addClass('hidden');
            $('#objectEditButton').removeClass('hidden');
            self.scope.$apply();
        };

        //console.log('End of constructor:', self.config.uuid);
    }

    switchState(state, args) {
        this.state.go(state, args);
    }

    fieldChange(model, form) {
        console.log('Fieldchange called! ', model, form);
    }


    callBackSD(schema) {
        console.log('[OE] Callback getting entries: ', schema);
        let origlist = this.objectproxy.lists[schema];
        console.log('[OE] Callback results: ', origlist);
        return origlist;

    }


//console.log("[OE] CB Results: ", this.Callback('mapview'));


    $onInit() {
        if (typeof this.scope.stateParams.uuid !== 'undefined') {
            this.config = {
                uuid: this.scope.stateParams.uuid,
                schema: this.scope.stateParams.schema,
                action: this.scope.stateParams.action
            };
        } else {
            console.log("INITIAL:", this.scope.initial, this.initial);
            let self = this;
            /*this.scope.$watch('$scope.uuid', function (newVal, oldVal, scope) {
                console.log('UUID has changed', newVal, oldVal);
            }, true);*/

            this.config = {
                uuid: this.uuid,
                schema: this.schema,
                action: this.action,
                model: this.initial,
                initial: this.initial
            };
            this.model = this.initial;
        }
        console.log('[OE] Handling object of type: ' + this.config.schema + 'UUID:' + this.config.uuid + ' Action:' + this.config.action);

        this.schemascreenname = this.config.schema.charAt(0).toUpperCase() + this.config.schema.slice(1);
        if (this.config.uuid === "" || typeof this.config.uuid === 'undefined') {
            this.config.action = 'Create';
            $('#objModified').removeClass('hidden');
        } else {
            this.config.action = 'Edit';
        }

        if (this.user.signedin) {
            this.getData();
        }
    }

    formAction(target, action, uuid) {
        console.log('[OE] FormAction initiated: ', target, action, uuid);

        this.socket.send({
            'component': target,
            'action': action,
            'data': uuid
        });
    }


    /*let editorChange = function () {
     if (this.model !== objectproxy.obj[$scope.uuid]) {
     console.log('[OE] Content has been modified locally.');

     $('#objectModified').removeClass('hidden');
     } else {
     console.log('[OE] Content changed from somewhere else.');
     console.log(this.model, objectproxy.obj[$scope.uuid]);
     }
     };

     this.$watchCollection('model', editorChange);
     */

    submitObject() {
        let model = this.model;
        if (this.config.action.toUpperCase() === 'CREATE') {
            model.uuid = 'create';
        }
        console.log('[OE] Object update initiated with ', model);
        this.objectproxy.putObject(this.config.schema, model);
    }

    test_onchange(a, b) {
        console.log('HELLO!', a, b);
    }


    submitObjectChange() {
        let model = this.model;

        console.log('[OE] Object update initiated with ', model);
        this.objectproxy.putObjectChange(this.config.schema, model);
    }


    deleteObject() {
        let model = this.model;
        if (this.config.action.toUpperCase() === 'CREATE') {
            model.uuid = 'create';
            this.notification.add('warning', 'Editor', 'Cannot delete object - it is not stored yet.');
            return;
        }
        console.log('[OE] Object deletion initiated with ', this.config.uuid);
        this.objectproxy.deleteObject(this.config.schema, this.config.uuid);
    }
}

objecteditor.$inject = ['$scope', '$stateParams', 'objectproxy', 'user', 'socket', 'schemata', '$rootScope', 'notification', '$state'];

export default objecteditor;

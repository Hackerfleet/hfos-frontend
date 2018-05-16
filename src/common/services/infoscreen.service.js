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

/**
 * Created by riot on 20.06.16.
 */
'use strict';

class InfoscreenService {
    /*@ngInject*/
    constructor($rootScope, $state, $timeout) {
        console.log('Infoscreen service constructing');
        this.rootscope = $rootScope;
        this.state = $state;
        this.timeout = $timeout;

        this.rotations = [];
        this.current_screen = 0;
        this.timer = null;
        this.enabled = false;

        let self = this;

        this.rotate = function() {
            console.log('Rotating screen');
            self.current_screen++;
            if (self.current_screen === self.rotations.length) {
                self.current_screen = 0;
            }

            let nextstate = self.rotations[self.current_screen];
            console.debug('WOULD NOW ROTATE TO:', nextstate);

            let kwargs = {};
            for (let arg of nextstate.args) {
                kwargs[arg.name] = arg.value;
            }

            console.debug(nextstate.state, kwargs);
            $state.go('app.' + nextstate.state, kwargs);
            self.timeout.cancel(self.timer);
            self.timer = self.timeout(self.rotate, self.rotations[self.current_screen].duration*1000);
        }
    }

    setRotations(rotations) {
        console.log('Setting rotations to ', rotations);
        this.rotations = rotations
    }


    toggleRotations(state) {
        console.log('New rotation state:', state);
        if (state) {
            this.timer = this.timeout(this.rotate, this.rotations[this.current_screen].duration*1000);

        } else {
            this.timeout.cancel(this.timer);
        }

        this.enabled = state;
    }

}

InfoscreenService.$inject = ['$rootScope', '$state', '$timeout'];

export default InfoscreenService;

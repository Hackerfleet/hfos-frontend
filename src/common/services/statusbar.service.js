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
 * Created by riot on 21.02.16.
 */


class StatusbarService {

    constructor(gettextcatalog) {
        console.log('StatusbarService constructing');
        this.messages = [];
        this.last_message = "";
        this.status = gettextcatalog.getString("Ready.");

        let self = this;
    }

    add(type, title, text) {
        console.log('[STATUSBAR] Emitting new statusbar');
        function strip(html) {
            let tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }
        let msg = {
            'time': new Date().toISOString(),
            'type': type,
            'title': strip(title),
            'text': strip(text)
        };
        this.messages.push(msg);
        this.last_message = msg;
    }

    set_status(text) {
        this.status = text;
    }
}

StatusbarService.$inject = ['gettextcatalog'];

export default StatusbarService;

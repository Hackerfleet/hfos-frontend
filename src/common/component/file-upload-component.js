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

class FileUploadComponent {

    constructor(socket) {

    }

    close() {
        console.log('Closed fileupload');
    }

    FileUpload() {
        console.log('[FileUpload] Trying to FileUpload: ', file);
        //this.FileUpload(this.username, this.password);
    }

    opentab(tabname) {
        console.log('[FileUpload] Switching tab to ', tabname);
        $('.nav-pills .active, .tab-content .active').removeClass('active');
        $('#' + tabname).addClass('active');
    }
}

FileUploadComponent.$inject = ['socket'];

export default FileUploadComponent;

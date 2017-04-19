/*
 * Hackerfleet Operating System
 * =====================================================================
 * Copyright (C) 2011-2016 riot <riot@c-base.org> and others.
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

import angular from 'angular';
import uirouter from 'angular-ui-router';

import {routing} from './objects.config.js';

import 'tv4';
import 'objectpath';

// TinyMCE - Core
import tinymce from 'tinymce/tinymce';
import 'tinymce/plugins/textcolor/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/themes/modern/theme';

// TinyMCE - Plugins
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/autoresize/plugin';

import 'tinymce/skins/lightgray/skin.min.css';

import 'tx-tinymce/tx-tinymce';

import 'angular-schema-form';
import 'angular-schema-form-bootstrap/bootstrap-decorator';


import 'angular-ui-select/select.css';
import 'angular-ui-select/select.js';
import 'angular-schema-form-dynamic-select/angular-schema-form-dynamic-select.js';
import 'angular-schema-form-dynamic-select/ui-sortable';

import 'schema-form-datetimepicker/schema-form-date-time-picker';

import 'angular-schema-form-tinymce/bootstrap-tinymce';

import 'angular-schema-form-colorpicker/bootstrap-colorpicker';

// This one is powerful, but the integration is completely outdated (sadly)..
//import 'ckeditor/ckeditor';
//import 'ng-ckeditor/ng-ckeditor';
//import 'angular-schema-form-ckeditor/bootstrap-ckeditor';

import editor from './editor/editor.js';
import list from './list/list.js';
import configurator from './configurator/configurator.js';

import editortemplate from './editor/editor.tpl.html';
import listtemplate from './list/list.tpl.html';
import configuratortemplate from './configurator/configurator.tpl.html';

export default angular
    .module('main.components.objects', [
        uirouter,
        'ui.select',
        'schemaForm',
        'schemaForm-datetimepicker',
        'schemaForm-tinymce'
    ])
    .config(routing)
    .component('objecteditor', {
        controller: editor,
        template: editortemplate,
        bindings: {schema: '@', uuid: '@', action: '@'}
    })
    .component('objectlist', {controller: list, template: listtemplate})
    .component('configurator', {controller: configurator, template: configuratortemplate})
    .name;

import angular from 'angular';
import uirouter from 'angular-ui-router';

import gridster from 'angular-gridster';
import 'angular-gridster/dist/angular-gridster.min.css';

import { routing } from './featuremenu.config.js';

import featureMenu from './menu/menu.js';
import template from './menu/menu.tpl.html';

export default angular
    .module('main.app.featuremenu', [uirouter])
    .config(routing)
    .component('featuremenu', {controller: featureMenu, template: template})
    .name;

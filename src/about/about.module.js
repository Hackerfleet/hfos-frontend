import angular from 'angular';
import uirouter from 'angular-ui-router';

import { routing } from './about.config.js';

import AboutComponent from './about-component/about-component';
import template from './about-component/about-component.tpl.html';

//console.log(socket);

export default angular
    .module('main.app.about', [uirouter])
    .config(routing)
    .component('aboutComponent', {controller: AboutComponent, template})
    .name;

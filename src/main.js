// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap-additions/dist/bootstrap-additions.css';
import './main.css';


// 3rd party modules
//import bootstrap from 'bootstrap';
import angular from 'angular';
import animate from 'angular-animate';
import cookies from 'angular-cookies';
import md5 from 'angular-md5';
import schemaForm from 'angular-schema-form';

//console.log('FOOBAR:', strap, ws, schemaForm);
//console.log(gridster);

// Modules
import app from './app/app.module';
import common from './common/common.module';
import featuremenu from './featuremenu/featuremenu.module';
import about from './about/about.module';

angular.module('main', ['mgcrea.ngStrap', 'gridster', 'ngWebSocket',
    animate, app, common, cookies, md5, featuremenu, about
]);

angular.element(document).ready(() => {
    angular.bootstrap(document, ['main']);
});

export function routing($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/menu');

    $stateProvider
        .state('app', {
            abstract: true,
            template: '<app-component></app-component>'
        })

}

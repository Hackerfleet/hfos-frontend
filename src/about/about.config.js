export function routing($stateProvider) {

    $stateProvider
        .state('app.about', {
            url: '/about',
            template: '<about-component></about-component>'
        });
}

export function routing($stateProvider) {

    $stateProvider
        .state('app.menu', {
            url: '/menu',
            template: '<featuremenu></featuremenu>'
        });
}

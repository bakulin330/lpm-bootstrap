angular.module("app", [
    "ui.router",
    "ngMessages",
    "btford.modal",
    "services.httpRequestTracker",
    "services.authInterceptor",
    "services.auth",
    "services.modal",
    //"templates.app", - нужно для шаблонов, которые компилируются прямо в JS
    "app.errors",
    "app.auth",
    "app.home"
]);

angular.module("app").config(["$httpProvider", "$urlRouterProvider", function ($httpProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/errors/list");
}]);

angular.module("app").run(["$state", "$http", "$urlRouter", "$rootScope", function ($state, $http, $urlRouter, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log("$stateChangeSuccess", toState);
    });
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        console.log("$stateChangeError - fired when an error occurs during transition.");
        console.log(arguments);
    });
    $rootScope.$on("$stateNotFound", function (event, unfoundState, fromState, fromParams) {
        console.log("$stateNotFound ", unfoundState.to + "  - fired when a state cannot be found by its name.");
        console.log(unfoundState, fromState, fromParams);
    });
}]);

angular.module("app").controller("AppCtrl", ["$scope", "$state", "httpRequestTracker", "authInterceptor", function ($scope, $state, httpRequestTracker, authInterceptor) {
    console.log('app controller');
}]);
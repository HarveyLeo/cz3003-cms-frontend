/**
 * Created by Haihui on 6/2/2016.
 */

"use strict";

var cmsApp = angular.module('cmsApp',[
    'ui.router',
    'cmsControllers'
]);

cmsApp.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES){
        $urlRouterProvider.otherwise('/public');
        $stateProvider
            .state('public', {
                url:'/public',
                templateUrl: 'partials/public.html'
            })
            .state('operator', {
                url: '/operator',
                templateUrl: 'partials/operator.html',
                data: {
                    authorizedRoles: [USER_ROLES.operator]
                }
            })
            .state('manager', {
                url: '/manager',
                templateUrl: 'partials/manager.html',
                data: {
                    authorizedRoles: [USER_ROLES.manager]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            });
    }
]);

cmsApp.run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
        if (next.data !== undefined) {
            var authorizedRoles = next.data.authorizedRoles;
            if (authorizedRoles !== undefined && !AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        }
    });
});


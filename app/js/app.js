/**
 * Created by Haihui on 6/2/2016.
 */

"use strict";

var cmsApp = angular.module('cmsApp',[
    'ui.router',
    'ui.bootstrap',
    'cmsControllers'
]);


cmsApp.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES',
    function($stateProvider, $urlRouterProvider, USER_ROLES){
        $urlRouterProvider.when('/operator', '/operator/create-new-incident');
        $urlRouterProvider.otherwise('/public');
        $stateProvider
            .state('public', {
                url:'/public',
                controller: 'publicCtrl',
                templateUrl: 'partials/public/public.html'
            })
            .state('agency', {
                url:'/agency',
                controller: 'agencyCtrl',
                templateUrl: 'partials/agency.html',
                data: {
                    authorizedRoles: [USER_ROLES.agency]
                }
            })
            .state('operator', {
                url: '/operator',
                abstract: true,
                templateUrl: 'partials/operator/operator.html'
            })
            .state('operator.create-new-incident', {
                url:'/create-new-incident',
                templateUrl: 'partials/operator/operator.create-new-incident.html',
                controller: 'createNewIncidentCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.operator]
                }
            })
            .state('operator.update-incident', {
                url:'/update-incident',
                templateUrl: 'partials/operator/operator.update-incident.html',
                controller: 'updateIncidentCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.operator]
                }
            })
            .state('operator.update-incident.edit', {
                url:'/update-incident/:incidentID',
                templateUrl: 'partials/operator/operator.update-incident.edit.html',
                controller: 'updateIncidentCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.operator]
                }
            })
            .state('manager', {
                url: '/manager',
                templateUrl: 'partials/manager.html',
                controller: 'managerCtrl'//,
                //data: {
                //    authorizedRoles: [USER_ROLES.manager]
                //}
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'loginCtrl'
            });
    }
]);

cmsApp.run(['$rootScope', 'AUTH_EVENTS', 'AuthService','$window','$state',
    function ($rootScope, AUTH_EVENTS, AuthService, $window, $state) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.data !== undefined) {
                var authorizedRoles = next.data.authorizedRoles;
                if (authorizedRoles !== undefined && !AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        $window.alert("You don't have access to the page.");
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        $state.go('login');
                    }
                }
            }
        });
    }
]);

cmsApp.filter('startFrom', function() {

    return function(input, start) {

        if (!input || !input.length) { return; }
        start = +start;
        return input.slice(start);
    }
});


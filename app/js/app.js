/**
 * Created by Haihui on 6/2/2016.
 */

"use strict";

var cmsApp = angular.module('cmsApp',[
    'ngRoute',
    'cmsControllers'
]);

cmsApp.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/public', {
            templateUrl: 'partials/public.html'
        })
        .when('/operator', {
            templateUrl: 'partials/operator.html'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        })
        .otherwise({
            redirectTo: '/public'
        });
}]);


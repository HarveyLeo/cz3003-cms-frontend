/**
 * Created by Haihui on 19/2/2016.
 */

"use strict";

var cmsServices = angular.module('cmsServices', []);

cmsServices.factory('AuthService', ['$http', 'Session',
    function($http, Session){
        var authService = {};
        authService.login = function(credentials) {
            return $http
                .post('http://cms-torophp.rhcloud.com/verify/', credentials)
                .then(function (res) {
                    Session.create(res.data.user_name, res.data.user_id, res.data.user_role);
                    return res.data;
                });
        };
        authService.isAuthenticated = function () {
            return !!Session.userId;
        };
        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        };
        return authService;
    }
]);

cmsServices.factory('FormService',['$http',
    function($http) {
        var formService = {};
        formService.submit = function(formdata) {
            return $http
                .post('http://cms-torophp.rhcloud.com/incident/', formdata)
                .then(function(res){
                   return res.data;
                });
        };
        return formService;
    }
]);

cmsServices.service('Session', function () {
    this.create = function (username, userId, userRole) {
        this.username = username;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function () {
        this.username = null;
        this.userId = null;
        this.userRole = null;
    };
});


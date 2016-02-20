/**
 * Created by Haihui on 19/2/2016.
 */

"use strict";

var cmsServices = angular.module('cmsServices', []);

cmsServices.factory('AuthService', ['$http', 'Session', function($http, Session){

    var authService = {};

    authService.login = function(credentials) {
        return $http
            .post('http://localhost/auth', credentials)
            .then(function (res) {
                Session.create(res.data.username, res.data.userId, res.data.userRole);
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
}]);

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
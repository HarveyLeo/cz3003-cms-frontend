/**
 * Created by Haihui on 19/2/2016.
 */

"use strict";

var cmsServices = angular.module('cmsServices', []);

cmsServices.factory('AuthService', ['Session','$http',
    function(Session, $http){
        var authService = {};
        authService.login = function(credentials) {
            return $http({
                method: 'POST',
                url: 'http://cms-torophp.rhcloud.com/verify/',
                data: $.param(credentials),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
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
            return $http({
                method: 'POST',
                url: 'http://cms-torophp.rhcloud.com/incident/',
                data: $.param(formdata),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                return res.data;
            });
        };
        return formService;
    }
]);


cmsServices.factory('IncidentService',['$http',
    function($http) {
        var incidentService = {};
        incidentService.getAllIncidents = function() {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/incident/'
            }).then(function (res) {
                return res.data;
            });
        };

        incidentService.getIncidentbyID = function(id) {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/incident/' + id
            }).then(function (res) {
                console.log(res);
                return res.data;
            });
        };
        return incidentService;
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


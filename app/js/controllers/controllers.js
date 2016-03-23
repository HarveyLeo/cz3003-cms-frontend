/**
 * Created by Haihui on 11/2/2016.
 */

"use strict";

var cmsControllers = angular.module('cmsControllers', [
    'cmsServices',
]);

cmsControllers.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

cmsControllers.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    operator: 'operator',
    manager: 'manager',
    agency: 'agency'
});


cmsControllers.controller('appCtrl', ['$scope', 'USER_ROLES', 'AuthService',
    function ($scope, USER_ROLES, AuthService) {
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };
    }
]);

cmsControllers.controller('loginCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService',
    function($scope, $rootScope, AUTH_EVENTS, AuthService){
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function(credentials) {
            AuthService.login(credentials).then(
                function(user){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                },
                function(){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                }
            );
        };
    }
]);

cmsControllers.controller('mapIncidentModalCtrl',
    function($scope, $uibModalInstance, incident){
        $scope.incident = incident;
        $scope.close = function(){$uibModalInstance.close();}
    }
);

cmsControllers.controller('publicCtrl',['$scope','$rootScope','$uibModal',
    function($scope, $rootScope, $uibModal){
        if (!$scope.NEAAPIInitialized) {
            initNEAAPI($scope);
            $scope.NEAAPIInitialized = true;
        }

        $rootScope.openMapModal = function(incident) {

            console.log(incident);

            var modalInstance;
            modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'partials/mapIncidentModal.html',
                    controller: 'mapIncidentModalCtrl',
                    resolve: {
                        incident : function(){return incident;}
                    }
            });

            modalInstance.result.then((function(selectedItem) {
                $scope.selected = selectedItem;
            }), function() {
                console.log('Modal dismissed at: ' + new Date);
            });
        };

        getCrisis($rootScope);
        getSyslog();
        initMap($rootScope);
    }
]);

cmsControllers.controller('createNewIncidentCtrl', ['$scope',
    function($scope) {
        $scope.incidentTypes = ['Type A', 'Type B', 'Type C'];
    }
]);

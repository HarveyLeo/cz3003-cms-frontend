/**
 * Created by Haihui on 11/2/2016.
 */

"use strict";

var cmsControllers = angular.module('cmsControllers', [
    'cmsServices',
    'ngMaterial'
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


cmsControllers.controller('appCtrl', ['$scope', 'USER_ROLES', 'AuthService', '$mdDialog',
    function ($scope, USER_ROLES, AuthService, $mdDialog) {
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.showAlert = function() {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('This is an alert title')
                    .textContent('You can specify some description text in here.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
            );
        };
    }
]);

cmsControllers.controller('loginCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService','$state',
    function($scope, $rootScope, AUTH_EVENTS, AuthService, $state){
        $scope.credentials = {
            user_email: '',
            user_password: ''
        };
        $scope.login = function(credentials) {
            AuthService.login(credentials).then(
                function(user){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                    var userRole = user.user_role;
                    if (userRole === "operator") {
                        $state.go('operator.create-new-incident');
                    } else if (userRole === "manager") {
                        $state.go('manager');
                    } else if (userRole === "agency") {
                        $state.go('agency');
                    }
                },
                function(){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    console.log("login failure");
                }
            );
        };
    }
]);

cmsControllers.controller('createNewIncidentCtrl', ['$scope','FormService',
    function($scope, FormService) {
        $scope.incidentTypes = ['Traffic Accident', 'Fire', 'Gas Leak'];
        $scope.incidentDetails = {
            incident_timestamp: '1458380218',
            incident_type: '',
            incident_address: '',
            incident_longitude: '1213',
            incident_latitude: '5645',
            incident_contactName: '',
            incident_contactNo: '',
            incident_description: '',
            incident_status:'',
            agency:'NEA',
            operator: ''
        };
        $scope.submitNewIncident = function(incidentDetails) {
            console.log($scope.currentUser);
            $scope.incidentDetails.operator = $scope.currentUser.user_id;

            FormService.submit(incidentDetails).then(function(data) {
                console.log(data);
                $scope.response = data;
                $scope.showAlert();
            }, function() {
                console.log("error");
                $scope.response = "error";
            });
        };
    }
]);


/**
 * Created by Haihui on 11/2/2016.
 */

"use strict";

var cmsControllers = angular.module('cmsControllers', [
    'cmsServices'
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
        $scope.incidentTypes = ['Traffic Accident', 'Fire', 'Gas Leak', 'Riot'];

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
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

cmsControllers.controller('updateIncidentCtrl', ['$scope','IncidentService','$stateParams',
    function($scope, IncidentService, $stateParams) {
        $scope.incidentID = $stateParams.incidentID;
        $scope.getAllIncidents = function() {
            IncidentService.getAllIncidents().then(function(data) {
                $scope.allIncidents = data;
            }, function() {
                console.log("error: getting all incidents");
            });
        };

        $scope.getIncidentbyID = function(id) {
            IncidentService.getIncidentbyID(id).then(function(data) {
                $scope.incident = data;
                console.log(data);
            }, function() {
                console.log("error: getting all incidents");
            });
        };
    }
]);
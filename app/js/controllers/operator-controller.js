"use strict";

cmsControllers.controller('createNewIncidentCtrl', ['$scope','IncidentCreationService',
    function($scope, IncidentCreationService) {
        $scope.incidentDetails = {
            incident_timestamp: '1458380218',
            incident_type: '',
            incident_address: '',
            incident_longitude: '',
            incident_latitude: '',
            incident_contactName: '',
            incident_contactNo: '',
            incident_description: '',
            incident_status:'',
            agency:'',
            operator: ''
        };
        $scope.submitNewIncident = function(incidentDetails) {
            console.log($scope.currentUser);
            $scope.incidentDetails.operator = $scope.currentUser.user_id;

            IncidentCreationService.submit(incidentDetails).then(function(data) {
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

cmsControllers.controller('updateIncidentCtrl', ['$scope','IncidentRetrievalService','$stateParams',
    function($scope, IncidentRetrievalService, $stateParams) {
        $scope.incidentID = $stateParams.incidentID;
        $scope.getAllIncidents = function() {
            IncidentRetrievalService.getAllIncidents().then(function(data) {
                $scope.allIncidents = data;
            }, function() {
                console.log("error: getting all incidents");
            });
        };

        $scope.getIncidentbyID = function(id) {
            IncidentRetrievalService.getIncidentbyID(id).then(function(data) {
                $scope.incident = data;
                console.log(data);
            }, function() {
                console.log("error: getting all incidents");
            });
        };
    }
]);
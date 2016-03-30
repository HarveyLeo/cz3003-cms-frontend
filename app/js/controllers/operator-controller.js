"use strict";

cmsControllers.controller('createNewIncidentCtrl', ['$scope','IncidentCreationService','$timeout',
    function($scope, IncidentCreationService, $timeout) {

        $scope.incidentDetails = {
            incident_timestamp: '',
            incident_type: '',
            incident_address: '',
            incident_longitude: '',
            incident_latitude: '',
            incident_contactName: '',
            incident_contactNo: '',
            incident_description: '',
            incident_status:'INITIATED',
            agency:'',
            operator: ''
        };

        $scope.convertToTimestamp = function() {
            var time_str = $("#new_incident_time").val();

            var parts = time_str.split(' ');
            var time_parts = parts[0].split(':');

            var hour = parseInt(time_parts[0]);
            var minute = parseInt(time_parts[1]);

            if (parts[1] == "PM"){
                hour += 12;
            }

            var today = new Date();
            var day = today.getDate();
            var month = today.getMonth() + 1;
            var year = today.getFullYear();

            if(month < 10){
                month = '0' + month;
            }

            if(day < 10){
                day = '0' + day;
            }

            var result = year + '-' + month + '-' + day + ' ' + hour + ":" + minute + ':00';

            $scope.incidentDetails.incident_timestamp = result;
        };

        $scope.submitNewIncident = function() {

            $scope.incidentDetails.operator = $scope.currentUser.user_id;
            $scope.incidentDetails.incident_latitude = $("#location").data("latitude");
            $scope.incidentDetails.incident_longitude = $("#location").data("longitude");
            $scope.convertToTimestamp();

            IncidentCreationService.submit($scope.incidentDetails).then(function(data) {
                console.log(data);
                $scope.response = data;
                $scope.showSuccess = true;
                $timeout(function() {
                    $scope.showSuccess = false;
                    $("#new_incident_time").val("");
                    $scope.incidentDetails = {
                        incident_timestamp: '',
                        incident_type: '',
                        incident_address: '',
                        incident_longitude: '',
                        incident_latitude: '',
                        incident_contactName: '',
                        incident_contactNo: '',
                        incident_description: '',
                        incident_status: 'INITIATED',
                        agency: '',
                        operator: ''
                    };
                }, 2000);
            }, function() {
                $scope.response = "error";
            });

        };



    }
]);

cmsControllers.controller('updateIncidentCtrl', ['$scope','IncidentRetrievalService','$stateParams',
    'IncidentUpdateService','$state','$timeout',
    function($scope, IncidentRetrievalService, $stateParams, IncidentUpdateService, $state, $timeout) {
        $scope.incidentID = $stateParams.incidentID;

        $scope.getAllIncidents = function() {
            IncidentRetrievalService.getAllIncidents().then(function(data) {
                $scope.allIncidents = data;
            }, function() {
                console.log("error: get all incidents");
            });
        };

        $scope.getIncidentbyID = function(id) {
            IncidentRetrievalService.getIncidentbyID(id).then(function(data) {
                $scope.incident = data;
            }, function() {
                console.log("error: get an incident");
            });
        };

        $scope.updateIncident = function() {

            IncidentUpdateService.update($scope.incident).then(function(data) {
                $scope.showSuccess = true;
                $timeout(function() {
                    $scope.showSuccess = false;
                    $state.go('operator.update-incident',{}, {reload: true});
                }, 2000);
                console.log(data);
            }, function() {
                console.log("error: update an incident");
            });
        }
    }
]);
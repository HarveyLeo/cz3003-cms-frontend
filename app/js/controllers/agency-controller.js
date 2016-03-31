"use strict";

cmsControllers.controller('agencyCtrl', ['$scope','FeedbackSubmissionService','IncidentRetrievalService','$timeout','FeedbackRetrievalService',
    function($scope, FeedbackSubmissionService, IncidentRetrievalService, $timeout, FeedbackRetrievalService){
        
        $scope.config = {
            currentPage: 0,
            pageSize: 5,
            showPendingOnly: false,
            showSuccess: false
        };

        $scope.agency = {
            agency_name: "",
            agency_abbreviation: ""
        };
        
        $scope.feedback = {
            incident_id: "",
            feedback_agency: $scope.currentUser.agency,
            feedback_description: "",
            feedback_status: "",
            feedback_timestamp: ""
        };

        $scope.incidentFeedback = {};
       
        $scope.submitFeedback = function() {

            console.log($scope.feedback);
            FeedbackSubmissionService.submit($scope.feedback).then(
                function(data) {
                    $scope.config.showSuccess = true;
                    $timeout(function() {
                        $scope.config.showSuccess = false;
                        $scope.feedback = {
                            incident_id: "",
                            feedback_agency: $scope.currentUser.agency,
                            feedback_description: "",
                            feedback_status: "",
                            feedback_timestamp: ""
                        };
                    }, 2000);
                    console.log(data);
                }, function() {
                    console.log("error: submit a feedback");
                }
            )
        };
        
        $scope.getIncidentsByAgency = function() {
            IncidentRetrievalService.getIncidentsByAgency($scope.currentUser.agency).then(
                function(data) {
                    $scope.assignedIncidents = data;
                }, function() {
                    console.log("error: submit a feedback");
                }
            )
        };
        
        $scope.getFeedbackByIncident = function(id) {
            FeedbackRetrievalService.getFeedbackByIncident(id).then(
                function(data) {
                    $scope.incidentFeedback[id] = data;
                }, function() {
                    console.log("error: get feedback for an incident");
                }
            )
            
        };


    }
]);
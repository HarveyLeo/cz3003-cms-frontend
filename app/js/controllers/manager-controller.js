cmsControllers.controller('managerCtrl', ['$scope','$stateParams','IncidentRetrievalService',
    '$uibModal','AgencyService','IncidentUpdateService', '$state', 'FeedbackRetrievalService', 'FeedbackSubmissionService',
    function($scope, $stateParams, IncidentRetrievalService, $uibModal,AgencyService, IncidentUpdateService, $state, FeedbackRetrievalService, FeedbackSubmissionService) {

        $scope.incidentID = $stateParams.incidentID;

        $scope.incidentConfig = {
            currentPage: 0,
            pageSize: 10,
            showPendingOnly: false
        };

        $scope.feedbackConfig = {
            currentPage: 0,
            pageSize: 10,
            showPendingOnly: false
        };

        $scope.curDate = "1";
        $scope.updateDate = function(feedback) {
            if (feedback.date != $scope.curDate) {
                $scope.curDate = feedback.date;
                return true;
            } else {
                return false;
            }
        };

        $scope.crisisDate = "1";
        $scope.updateIncidentDate = function(incident) {
            if (incident.date != $scope.crisisDate) {
                $scope.crisisDate = incident.date;
                return true;
            } else {
                return false;
            }
        };

        $scope.getAllIncidents = function() {
            IncidentRetrievalService.getAllIncidents().then(function(data) {

                for (var i in data) {
                    var incident = data[i];
                    var datetime = incident.incident_timestamp.split(" ");

                    incident.date = datetime[0];
                    incident.time = datetime[1];
                }

                $scope.allIncidents = data;
            }, function() {
                console.log("error: getting all incidents");
            });
        };

        $scope.getAllFeedbacks = function() {
            FeedbackRetrievalService.getAllFeedbacks().then(function(data) {

                var pendingFeedbacks = [], reviewedFeedbacks = [];

                if($scope.allIncidents != null) {

                    for (var i in data) {
                        var feedback = data[i];
                        for (var j in $scope.allIncidents) {
                            var incident = $scope.allIncidents[j];
                            if (incident.incident_id == feedback.incident_id) {
                                feedback["incident"] = incident;
                                //console.log(incident);
                                break;
                            }
                        }
                    }
                }

                //console.log(data);

                for (var i in data) {

                    var feedback = data[i];

                    if (feedback.feedback_status == "PENDING") {
                        pendingFeedbacks.push(feedback);
                    } else if (feedback.feedback_status == "REVIEWED") {
                        reviewedFeedbacks.push(feedback);
                    }

                    var datetime = feedback.feedback_timestamp.split(" ");
                    feedback.date = datetime[0];
                    feedback.time = datetime[1];
                }

                $scope.allFeedbacks = data;
                $scope.pendingFeedbacks = pendingFeedbacks;
                $scope.reviewedFeedbacks = reviewedFeedbacks;

                //console.log(pendingFeedbacks);

            }, function() {
                console.log("error: getting all feedbacks");
            })
        };

        $scope.getAllAgencies = function() {
            AgencyService.getAllAgencies().then(function(data) {
                $scope.allAgencies = data;
            }, function() {
                console.log("error: getting all agencies");
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

        $scope.openMapModal = function(incident) {

            var modalInstance;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/manager/manager.map-incident-modal.html',
                controller: 'mapIncidentModalCtrlForManager',
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

        $scope.getIncidentsForMap = function() {
            IncidentRetrievalService.getAllIncidents().then(function(data) {

                var results = [], closed_incidents = [], pending_incidents = [], approved_incidents = [], rejected_incidents = [];

                for(var i = 0;i<data.length;i++){
                    if(data[i].incident_status == "APPROVED"){
                        results.push(data[i]);
                        approved_incidents.push(data[i]);
                    } else if(data[i].incident_status == "CLOSED") {
                        closed_incidents.push(data[i]);
                    } else if(data[i].incident_status == "INITIATED") {
                        pending_incidents.push(data[i]);
                        results.push(data[i]);

                    } else if (data[i].incident_status == "REJECTED") {
                        rejected_incidents.push(data[i]);
                    }
                }

                $scope.incidents = data;
                $scope.approved_incidents = results;
                $scope.pending_incidents = pending_incidents;
                $scope.closed_incidents = closed_incidents;
                $scope.rejected_incidents = rejected_incidents;

                $(".current-crisis").text(approved_incidents.length);
                $(".undeclared-crisis").text(pending_incidents.length);
                $(".solved-crisis").text(closed_incidents.length);

                resetMarkers($scope, results);
                $(".crisis").text(results.length);
            }, function() {
                console.log("error: getting all incidents");
            });
        };


        $scope.initMap = function() {
            initMap($scope);
        };

        $scope.showInitiatedIncidents = function(type) {
            var results = [];
            if(type == null)
                resetMarkers($scope, $scope.pending_incidents);
            else{
                switch(type) {
                    case "Traffic Accident":
                        for (var i=0;i<$scope.pending_incidents.length;i++){
                            var incident = $scope.pending_incidents[i];
                            if (incident.incident_type == "Traffic Accident") {
                                results.add(incident);
                            }

                            resetMarkers($scope, results);
                        }
                        break;
                    case "Fire":
                        for (var i=0;i<$scope.pending_incidents.length;i++){
                            var incident = $scope.pending_incidents[i];
                            if (incident.incident_type == "Fire") {
                                results.add(incident);
                            }

                            resetMarkers($scope, results);
                        }
                        break;
                    case "Gas Leak":
                        for (var i=0;i<$scope.pending_incidents.length;i++){
                            var incident = $scope.pending_incidents[i];
                            if (incident.incident_type == "Gas Leak") {
                                results.add(incident);
                            }

                            resetMarkers($scope, results);
                        }
                        break;
                    case "Riot":
                        for (var i=0;i<$scope.pending_incidents.length;i++){
                            var incident = $scope.pending_incidents[i];
                            if (incident.incident_type == "Riot") {
                                results.add(incident);
                            }

                            resetMarkers($scope, results);
                        }

                        break;
                }
            }
        };

        $scope.showApprovedIncidents = function(type) {
            resetMarkers($scope, $scope.approved_incidents);
        };

        $scope.showRejectedIncidents = function(type) {
            resetMarkers($scope, $scope.rejected_incidents);
        };

        $scope.showClosedIncidents = function(type) {
            resetMarkers($scope, $scope.closed_incidents);
        };



        $scope.complete = function(incident){
            incident.incident_status = "CLOSED";
            IncidentUpdateService.update(incident).then(function(data) {
                console.log(data);
                $state.go('manager.crisis-log',{}, {reload: true});
            })
        };

        $scope.reject = function(incident){
            incident.incident_status = "REJECTED";
            IncidentUpdateService.update(incident).then(function(data) {
                console.log(data);
                $state.go('manager.feedback-log',{}, {reload: true});
            })
        };

        $scope.confirm = function (incident) {
            incident.incident_status = "APPROVED";
            incident.agency = $("#agency-select-" + incident.incident_id).val();
            incident.agency_name = $("#agency-select-" + incident.incident_id).data("agency");
            IncidentUpdateService.update(incident).then(function(data) {
                $state.go('manager.feedback-log',{}, {reload: true});
            })
        };

        $scope.review = function (feedback) {
            feedback.feedback_status = "REVIEWED";

            FeedbackSubmissionService.update(feedback).then(function(data) {
                console.log(data);
                // $state.go('manager.feedback-log',{}, {reload: true});
            })
        };
    }
]);

cmsControllers.controller('mapIncidentModalCtrlForManager',
    function($scope, incident, $uibModalInstance, AgencyService, IncidentUpdateService, $state){

        $scope.incident = incident;

        $scope.close = function(){
            $uibModalInstance.close();
        };

        $scope.getAllAgencies = function() {
            AgencyService.getAllAgencies().then(function(data) {
                $scope.allAgencies = data;
            }, function() {
                console.log("error: getting all agencies");
            });
        };

        $scope.confirm = function (incident) {
            incident.incident_status = "APPROVED";
            incident.agency = $("#agency-select-" + incident.incident_id).val();
            incident.agency_name = $("#agency-select-" + incident.incident_id).data("agency");
            IncidentUpdateService.update(incident).then(function(data) {
                $state.go('manager.map-and-timeline',{}, {reload: true});
            })
        };

        $scope.reject = function(incident){
            incident.incident_status = "REJECTED";
            IncidentUpdateService.update(incident).then(function(data) {
                $state.go('manager.map-and-timeline',{}, {reload: true});
            })
        };

        $scope.complete = function(incident){
            incident.incident_status = "CLOSED";
            IncidentUpdateService.update(incident).then(function(data) {
                $state.go('manager.map-and-timeline',{}, {reload: true});
            })
        };
    }
);
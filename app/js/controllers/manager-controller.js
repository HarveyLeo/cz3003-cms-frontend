cmsControllers.controller('managerCtrl', ['$scope','$stateParams','IncidentRetrievalService',
    '$uibModal','AgencyService','IncidentUpdateService', '$state', 'FeedbackRetrievalService', 'FeedbackSubmissionService',
    function($scope, $stateParams, IncidentRetrievalService, $uibModal,AgencyService, IncidentUpdateService, $state, FeedbackRetrievalService, FeedbackSubmissionService) {

        $scope.incidentID = $stateParams.incidentID;

        $scope.config = {
            currentPage: 0,
            pageSize: 4
        };

        $scope.feedbackConfig = {
            currentPage: 0,
            pageSize: 4
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
        }

        $scope.getAllAgencies = function() {
            AgencyService.getAllAgencies().then(function(data) {
                $scope.allAgencies = data;
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

        $scope.openMapModal = function(incident) {

            console.log(incident);

            var modalInstance;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/public/public.map-incident-modal.html',
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

        //$scope.getIncidentsLog = function() {
        //    IncidentRetrievalService.getAllIncidents().then(function(data) {
        //       var results = [];
        //
        //        for(var i = 0;i<data.length)
        //    });
        //};

        $scope.initMap = function() {
            initMap($scope);
        };

        $scope.showInitiatedIncidents = function() {
            resetMarkers($scope, $scope.pending_incidents);
        }

        $scope.showApprovedIncidents = function() {
            resetMarkers($scope, $scope.approved_incidents);
        }

        $scope.showRejectedIncidents = function() {
            resetMarkers($scope, $scope.rejected_incidents);
        }

        $scope.showClosedIncidents = function() {
            resetMarkers($scope, $scope.closed_incidents);
        }

        $scope.openToDo = function(pending_incident) {
            console.log(pending_incident);

            var modalInstance;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/public/public.map-pending-incident-modal.html',
                controller: 'mapIncidentModalCtrl',
                resolve: {
                    incident : function(){return pending_incident;}
                }
            });

            modalInstance.result.then((function(selectedItem) {
                $scope.selected = selectedItem;
            }), function() {
                console.log('Modal dismissed at: ' + new Date);
            });
        };

        $scope.reject = function(incident){
            incident.incident_status = "REJECTED";
            IncidentUpdateService.update(incident).then(function(data) {
                console.log(data);
                $state.go('manager',{}, {reload: true});
            })
        };

        $scope.confirm = function (incident) {
            incident.incident_status = "APPROVED";
            IncidentUpdateService.update(incident).then(function(data) {
                console.log(data);
                $state.go('manager',{}, {reload: true});
            })
        };

        $scope.review = function (feedback) {
            feedback.feedback_status = "REVIEWED";

            FeedbackSubmissionService.update(feedback).then(function(data) {
                console.log(data);
                $state.go('manager',{}, {reload: true});
            })
        }
    }
]);
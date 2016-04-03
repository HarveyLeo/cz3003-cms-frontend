"use strict";

cmsControllers.controller('mapIncidentModalCtrl',
    function($scope, $uibModalInstance, incident){
        $scope.incident = incident;
        $scope.close = function(){$uibModalInstance.close();};
        $scope.confirm = function(){};
    }
);

cmsControllers.controller('publicCtrl',['$scope', '$uibModal','IncidentRetrievalService','FeedbackRetrievalService',
    function($scope, $uibModal, IncidentRetrievalService,FeedbackRetrievalService){
        if (!$scope.NEAAPIInitialized) {
            initNEAAPI($scope);
            $scope.NEAAPIInitialized = true;
        }

        $scope.config = {
            currentPage: 0,
            pageSize: 5
        };

        $scope.curDate = "1";
        $scope.updateDate = function(incident) {

            console.log($scope.curDate);
            if (incident.date != $scope.curDate) {
                $scope.curDate = incident.date;
                return true;
            } else {
                return false;
            }
        }

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

        $scope.openMapModal = function(incident) {

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

                var results = [];

                for(var i = 0;i<data.length;i++){
                    if(data[i].incident_status == "APPROVED"){
                        results.push(data[i]);
                    }
                }

                $scope.incidents = data;
                $scope.approved_incidents = results;
                resetMarkers($scope, results);
                $(".crisis").text(results.length);
            }, function() {
                console.log("error: getting all incidents");
            });
        };

        $scope.initMap = function() {
            initMap($scope);
        }


    }
]);
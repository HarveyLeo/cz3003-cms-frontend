cmsControllers.controller('managerCtrl', ['$scope','$stateParams','IncidentRetrievalService', 'LogRetrievalService','$uibModal',
    function($scope, $stateParams, IncidentRetrievalService, LogRetrievalService, $uibModal) {

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

                var results = [];

                for(var i = 0;i<data.length;i++){
                    if(data[i].incident_status == "Confirmed"){
                        results.push(data[i]);
                    }
                }

                $scope.incidents = results;
                resetMarkers($scope, results);
                $(".crisis").text(results.length);
            }, function() {
                console.log("error: getting all incidents");
            });
        };

        $scope.getSystemLog = function() {
            LogRetrievalService.getAllLogs().then(function(data) {
                for(var i = 0;i < data.length;i++){
                    $("#syslog-body").append("<tr><td>"+ data[i].message +"</td><td>"+ data[i].timestamp +"</td></tr>");
                }
            }, function() {
                console.log("error: getting all logs");
            });
        };

        $scope.initMap = function() {
            initMap($scope);
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
        }

        $scope.getToDoList = function() {
            IncidentRetrievalService.getAllIncidents().then(function(data) {

                //console.log(data);

                var incidents = data;

                var confirmed_incidents = [];
                var pending_incidents = [];
                var completed_incidents = [];

                incidents[3].incident_status = "Pending";

                for (var i = 0 ; i < incidents.length;i++) {
                    //console.log(incidents[i]);

                    if (incidents[i].incident_status == "Confirmed") {
                        confirmed_incidents.push(incidents[i]);
                    } else if (incidents[i].incident_status == "Pending") {
                        pending_incidents.push(incidents[i]);
                    } else if(incidents[i].incident_status == "Completed") {
                        completed_incidents.push(incidents[i]);
                    }
                }

                $(".current-crisis").text(confirmed_incidents.length);
                $(".undeclared-crisis").text(pending_incidents.length);
                $(".solved-crisis").text(completed_incidents.length);

                $scope.pending_incidents = pending_incidents;
                $scope.completed_incidents = completed_incidents;
                $scope.confirmed_incidents = confirmed_incidents;

            }, function() {
                console.log("error: getting all incidents");
            });


        }
    }
]);
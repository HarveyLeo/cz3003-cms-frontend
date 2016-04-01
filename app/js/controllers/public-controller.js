"use strict";

cmsControllers.controller('mapIncidentModalCtrl',
    function($scope, $uibModalInstance, incident){
        $scope.incident = incident;
        $scope.close = function(){$uibModalInstance.close();}
        $scope.confirm = function(){};
    }
);

cmsControllers.controller('publicCtrl',['$scope', '$uibModal','IncidentRetrievalService', 'LogRetrievalService',
    function($scope, $uibModal, IncidentRetrievalService, LogRetrievalService){
        if (!$scope.NEAAPIInitialized) {
            initNEAAPI($scope);
            $scope.NEAAPIInitialized = true;
        }

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


    }
]);
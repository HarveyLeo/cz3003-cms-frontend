"use strict";

cmsServices.factory('IncidentRetrievalService',['$http',
    function($http) {
        var incidentService = {};
        incidentService.getAllIncidents = function() {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/incident/'
            }).then(function (res) {
                return res.data;
            });
        };

        incidentService.getIncidentbyID = function(id) {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/incident/' + id
            }).then(function (res) {
                console.log(res);
                return res.data;
            });
        };
        return incidentService;
    }
]);


cmsServices.factory('IncidentCreationService',['$http',
    function($http) {
        var formService = {};
        formService.submit = function(formdata) {
            return $http({
                method: 'POST',
                url: 'http://cms-torophp.rhcloud.com/incident/',
                data: $.param(formdata),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                return res.data;
            });
        };
        return formService;
    }
]);


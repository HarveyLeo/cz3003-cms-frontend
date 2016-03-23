"use strict";

cmsServices.factory('LogRetrievalService',['$http',
    function($http) {
        var logService = {};
        logService.getAllLogs = function() {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/log/'
            }).then(function (res) {
                return res.data;
            });
        };

        return logService;
    }
]);
"use strict";

cmsServices.factory('FeedbackSubmissionService',['$http',
    function($http) {
        var feedbackService = {};
        feedbackService.submit = function(formdata) {
            return $http({
                method: 'POST',
                url: 'http://cms-torophp.rhcloud.com/feedback/',
                data: $.param(formdata),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                return res.data;
            });
        };

        return feedbackService;
    }
]);

cmsServices.factory('FeedbackRetrievalService',['$http',
    function($http) {
        var feedbackService = {};
        feedbackService.getFeedbackByIncident = function(incident_id) {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/incident/' + incident_id + '/feedback/'
            }).then(function (res) {
                return res.data;
            });
        };

        return feedbackService;
    }
]);
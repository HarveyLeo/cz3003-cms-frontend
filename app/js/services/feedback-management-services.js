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

        feedbackService.update = function(formdata) {
            return $http({
                method: 'PUT',
                url: 'http://cms-torophp.rhcloud.com/feedback/' + formdata.feedback_id,
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

        feedbackService.getAllFeedbacks = function() {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/feedback/'
            }).then(function (res) {
                return res.data;
            });
        };

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


cmsServices.factory('AgencyService',['$http',
    function($http) {
        var agencyService = {};
        agencyService.getAllAgencies = function() {
            return $http({
                method: 'GET',
                url: 'http://cms-torophp.rhcloud.com/agency/'
            }).then(function (res) {
                return res.data;
            });
        };

        return agencyService;
    }
]);

"use strict";

cmsControllers.controller('mainCtrl', ['$scope', 'USER_ROLES', 'AuthService',
    function ($scope, USER_ROLES, AuthService) {
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
        $scope.incidentTypes = ['Traffic Accident', 'Fire', 'Gas Leak', 'Riot'];

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

    }
]);
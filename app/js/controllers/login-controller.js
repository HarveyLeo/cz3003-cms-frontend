"use strict";

cmsControllers.controller('loginCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService','$state',
    function($scope, $rootScope, AUTH_EVENTS, AuthService, $state){
        $scope.credentials = {
            user_email: '',
            user_password: ''
        };
        $scope.login = function(credentials) {
            AuthService.login(credentials).then(
                function(user){
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                    var userRole = user.user_role;
                    if (userRole === "operator") {
                        $state.go('operator.create-new-incident');
                    } else if (userRole === "manager") {
                        $state.go('manager');
                    } else if (userRole === "agency") {
                        $state.go('agency');
                    }
                },
                function(){
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    console.log("login failure");
                }
            );
        };
    }
]);
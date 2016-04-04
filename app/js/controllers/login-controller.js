"use strict";

cmsControllers.controller('loginCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService','$state',
    function($scope, $rootScope, AUTH_EVENTS, AuthService, $state){
        $scope.credentials = {
            user_email: '',
            user_password: ''
        };
        $scope.login = function(credentials) {
            if (!(credentials.user_email && credentials.user_password)) {
                $scope.errorMsg = "Your log-in detail is not complete!"
            } else {
                AuthService.login(credentials).then(
                    function(user){
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $scope.errorMsg = "";
                        console.log(user);
                        $scope.setCurrentUser(user);
                        var userRole = user.user_role;
                        if (userRole === "operator") {
                            $state.go('operator.create-new-incident');
                        } else if (userRole === "manager") {
                            $state.go('manager.map-and-timeline');
                        } else if (userRole === "agency") {
                            $state.go('agency');
                        } else {
                            $scope.errorMsg = "Incorrect username or password entered";
                        }
                    },
                    function(){
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        $scope.errorMsg = "Unable to establish connection";
                    }
                );
            }

        };
    }
]);
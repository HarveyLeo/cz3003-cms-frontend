/**
 * Created by Haihui on 11/2/2016.
 */

var cmsControllers = angular.module('cmsControllers', []);

cmsControllers.controller('loginCtrl', ['$scope', '$location', function($scope, $location){
    $scope.submit = function() {
        if($scope.uname == 'admin@gmail.com' && $scope.pword == 'admin'){
            $location.path('/operator');
        }else {
            alert('wrong credentials');
        }
    };
}]);

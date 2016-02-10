/**
 * Created by Haihui on 6/2/2016.
 */

var app = angular.module('mainApp',['ngRoute']);

app.controller('loginCtrl', ['$scope', '$location', function($scope, $location){
    $scope.submit = function() {
        if($scope.uname == 'admin@gmail.com' && $scope.pword == 'admin'){
            alert('correct credentials');
            $location.path('/operator');
        }else {
            alert('wrong credentials');
        }
    };
}]);


app.config(function($routeProvider){
    $routeProvider
        .when('/public', {
            templateUrl: 'partials/public.html'
        })
        .when('/operator', {
            templateUrl: 'partials/operator.html'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginCtrl'
        })
        .otherwise({
            redirectTo: '/public'
        });
});


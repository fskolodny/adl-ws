(function() {
    var app = angular.module('simpleApp',[]);
    app.controller('loginController',
                   ['$scope', '$http', '$location', '$rootScope',
                    function($scope, $http, $location, $rootScope) {
                        $scope.$watch('facility', function(newValue, oldValue) {
                            if(!newValue) return;
                            $scope.resetUnits();
                            $http.get('/units', {
                                params: {facility: newValue.facilityKey}
                            }).success(function(data, status, headers, config) {
                                $scope.units = data;
                            }).error(function(data, status, headers, config) {
                                console.log(status);
                            });
                        });
                        $scope.resetUnits = function() {
                            $scope.unit = undefined;
                            $scope.units = [];
                        };
                        $scope.resetFacility = function() {
                            $scope.facility = undefined;
                            $scope.resetUnits();
                        };
                        $scope.resetFacilities = function() {
                            $scope.facilities = [];
                            $scope.resetFacility();
                        };
                        $scope.getFacilities = function() {
                            $scope.oldUser = $scope.user;
                            $scope.resetFacilities();
                            $http.get('/facilities', {
                                params: {user: $scope.user}
                            }).success(function(data, status, headers, config) {
                                $scope.facilities = data;
                            }).error(function(data, status, headers, config) {
                                console.log(status);
                            });
                        };
                        $scope.login = function() {
                            $http.post('/login', {
                                user: $scope.user,
                                password: $scope.password
                            }).success(function(data, status, headers, config) {
                                $scope.isLoggedOn = data.isLoggedOn;
                                if($scope.isLoggedOn) {
                                    $rootScope.user = $scope.user;
                                    $rootScope.facility = $scope.facility;
                                    $rootScope.unit = $scope.unit;
                                    $location.path('/patients');
                                }
                            });
                        };
                        $scope.reset = function() {
                            $scope.user = $scope.oldUser = $scope.password = undefined;
                            $scope.resetFacilities();
                            $scope.loginForm.$setPristine();
                        };
                    }]);
})();

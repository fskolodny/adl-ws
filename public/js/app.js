(function() {
    var app = angular.module('simpleApp', ['ngRoute']);
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login.html',
            controller: 'loginController'
        }).when('/patients', {
            templateUrl: 'patients.html',
            controller: 'patientsController'
        }).otherwise({
            redirectTo: '/login'
        });
    }]);
    app.controller('patientsController',
                   ['$scope', '$http', '$location', '$routeParams',
                    '$rootScope',
                    function($scope, $http, $location, $routeParams,
                             $rootScope) {
                        $scope.user = $rootScope.user;
                        $scope.facility = $rootScope.facility;
                        $scope.unit = $rootScope.unit;
                        $scope.selectPatient = function(patient) {
                            console.log('patient ' + patient + ' selected');
                        };
                        $http.get('/patients', {
                            params: {
                                facility: $scope.facility.facilityKey,
                                unit: $scope.unit.unitCode
                            }
                        }).success(function(data, status, headers, config) {
                            $scope.patients = data;
                        }).error(function(data, status, headers, config) {
                            console.log(status);
                        });
                    }]);
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

(function() {
    var app = angular.module('simpleApp',[]);
    app.controller('simpleController',
                   ['$scope', '$http',
                    function($scope, $http) {
                        $scope.sum = 1 + 3;
                        $scope.getFacilities = function() {
                            $http.get('/facilities',
                                      {params: {user: $scope.user}})
                                .success(function(data, status, headers, config) {
                                    $scope.facilities = data;
                                }).error(function(data, status, headers, config) {
                                    console.log(status);
                                });
                        };
                    }]);
})();

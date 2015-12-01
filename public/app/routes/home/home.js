(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.home', {
    url: '/home',
    templateUrl: 'app/routes/home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', 'Auth', function ($scope, Auth) {
  
  $scope.auth = Auth;
  
}]);

})();
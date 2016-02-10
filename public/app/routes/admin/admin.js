(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.admin', {
    url: '/admin',
    templateUrl: 'routes/admin/admin.html',
    controller: 'AdminCtrl',
    title: 'Admin'
  });
}])
.controller('AdminCtrl', ['$scope', 'Auth', function ($scope, Auth) {
  
  $scope.auth = Auth;
  
  
  
}]);

})();
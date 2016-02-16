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
.controller('AdminCtrl', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {
  
  $scope.auth = Auth;
  
  $scope.state = $state.current.name;
  
  $scope.$watch(function () {
    return $state.current;
  }, function (currentState, oldState) {
    
    $scope.state = currentState.name;
    
  })
  
}]);

})();
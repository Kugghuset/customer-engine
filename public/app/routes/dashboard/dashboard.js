(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.dashbaord', {
    url: '/dashboard',
    templateUrl: 'app/routes/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])
.controller('DashboardCtrl', ['$scope', 'Auth', 'Ticket', function ($scope, Auth, Ticket) {
  
  $scope.auth = Auth;
  $scope.user = Auth.getCurrentUser();
  
  /**
   * Watches for changes in the user and sets the value of the scoped user.
   */
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
  })
  
}]);

})();
(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.login', {
    url: '/login',
    templateUrl: 'routes/login/login.html',
    controller: 'LoginCtrl'
  });
}])
.controller('LoginCtrl', ['$scope', '$stateParams', '$location', 'Auth', 'Ticket', function ($scope, $stateParams, $location, Auth, Ticket) {
  
  $scope.currentTicketId = $stateParams.ticketId;
  
  $scope.auth = Auth;
  $scope.user = Auth.getCurrentUser();
  
  /**
   * Watches for changes in the user and sets the value of the scoped user.
   */
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
  });
  
}]);

})();
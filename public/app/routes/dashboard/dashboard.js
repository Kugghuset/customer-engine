(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.dashboard', {
    url: '/dashboard',
    templateUrl: 'app/routes/dashboard/dashboard.html',
    controller: 'DashboardCtrl'
  });
}])
.controller('DashboardCtrl', ['$scope', '$timeout', 'Auth', 'Ticket', function ($scope, $timeout, Auth, Ticket) {
  
  $scope.user;
  
  $scope.tickets = [];
  $scope.isLoading = false;
  
  function getTickets(userId, loading) {
    $scope.isLoading = loading;
    Ticket.getByUserId(userId)
    .then(function (tickets) {
      $scope.tickets = tickets;
      $scope.isLoading = false;
    })
    ['catch'](function (err) {
      // Oh no!
      $scope.isLoading = false;
    })
  }
  
  /**
   * Watches for changes in the user and sets the value of the scoped user.
   */
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
      
    if (user && user.userId) {
      getTickets(user.userId);
    }
  });
  
  function setup() {
    $scope.user = Auth.getCurrentUser();
      if ($scope.user && $scope.user.userId) {
        getTickets($scope.user.userId);
      }
  }
  
  setup();
  
  // To ensure setup :)
  $timeout(function () {
    if ($scope.tickets &&  !$scope.tickets.length) {
      setup();
    }
  }, 2000);
  
}]);

})();
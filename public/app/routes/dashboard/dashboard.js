(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.dashboard', {
    url: '/dashboard',
    templateUrl: 'routes/dashboard/dashboard.html',
    controller: 'DashboardCtrl',
    title: 'Dashboard'
  });
}])
.controller('DashboardCtrl', ['$scope', '$timeout', '$q', 'Auth', 'Ticket', function ($scope, $timeout, $q, Auth, Ticket) {
  
  $scope.user;
  
  $scope.tickets = [];
  $scope.isLoading = false;
  
  function getTickets(userId, loading) {
    $scope.isLoading = _.isUndefined(loading) ? true : loading;
    
    
    $q.all([
      Ticket.getByUserId(userId),
      Ticket.getStatusTickets(userId)
    ])
    .then(function (res) {
      $scope.tickets = res[0];
      $scope.statusTickets = res[1];
      
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
  
  function setup(setLoading) {
    
    setLoading = _.isUndefined(setLoading) ? true : setLoading;
    
    $scope.user = Auth.getCurrentUser();
    
    if ($scope.user && $scope.user.userId) {
      getTickets($scope.user.userId, setLoading);
    }
  }
  
  /**
   * Gets tickets updated the last five seconds by the current user.
   */
  function getUpdates() {
    
    Ticket.getFresh(Auth.getCurrentUser().userId)
    .then(function (tickets) {
      
      // Nothing new here
      if (!tickets.length) { return; }
      
      $scope.tickets = Ticket.merge($scope.tickets, tickets);
    })
    ['catch'](function (err) {
      console.log(err);
    });
    
  }
  
  /**
   * Returns either true or false for whether the ticket should be shown.
   * 
   * @param {Object} ticket
   * @param {String} tickFilter
   * @return {Boolean}
   */
  $scope.showTicket = function (ticket, tickFilter) {
    
    // Obviously, tickets tagged with *hide* should not be shown.
    if (ticket.hide) { return false; }
    
    // If there is no tickFilter, the ticket should be shown.
    if (!tickFilter) { return true; }
    
    // If it's the special snowflake 'ClosedTransferred', check for 'Closed' and transferred.
    if (tickFilter === 'ClosedTransferred') {
      return ticket.transferred && ticket.status === 'Closed';
    }
    
    // Return whether the status matches *tickFilter*
    return ticket.status === tickFilter;
  }
  
  
  // Run the set up.
  setup();
  
  // To ensure setup :)
  $timeout(function () {
    if ($scope.tickets && !$scope.tickets.length) {
      setup();
    }
  }, 2000);
  
  // Wait four seconds and setup again to fetch very recent updates.
  $timeout(function () {
    getUpdates();
  }, 4000);
  
}]);

})();
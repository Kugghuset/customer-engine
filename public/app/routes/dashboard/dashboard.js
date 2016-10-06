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

  $scope.auth = Auth;

  $scope.lastSetup = null;

  $scope.tickets = [];
  // initial state is loading
  $scope.isLoading = true;
  $scope.ticketsLoading = false;

  var _currentUpdate = {
    date: null,
    pageNum: null,
    userId: null,
  }

  $scope.state = {
    currentPage: 1
  };

  function getTickets(userId, loading, pageNum) {

    $scope.isLoading = _.isUndefined(loading) ? true : loading;

    $scope.ticketsLoading = true;

    pageNum = _.isUndefined(pageNum) ? 1 : pageNum;

    if (_currentUpdate.userId === userId && _currentUpdate.pageNum === pageNum && Math.abs(_currentUpdate.date - new Date()) < 200) {
      console.log('Not fetching new Tickets');
    } else {
      _currentUpdate = {
        userId: userId,
        pageNum: pageNum,
        date: new Date(),
      };
    }

    Ticket.getDashboard(userId, { top: 20, page: pageNum, order: 'desc' })
    .then(function (res) {
      $scope.tickets = res.tickets;

      // Get the status info
      $scope.statusInfo = {
        statuses: _.reduce(
          res.statusInfo,
          function (obj, current, i) { return _.assign({}, obj, _.set({}, current.status, current.statusCount)); },
          {}
        ),
        totalCount: res.totalCount,
      }

      $scope.isLoading = false;

      $scope.ticketsLoading = false;
    })
    ['catch'](function (err) {
      // Oh no!
      $scope.isLoading = false;
      $scope.ticketsLoading = false;
    })
  }

  /**
   * Watches for changes in the user and sets the value of the scoped user.
   */
  $scope.$watch('auth.getCurrentUser().userId', function (userId, oldUserId) {
    $scope.user = Auth.getCurrentUser();

    if (userId && oldUserId !== userId) {
      $scope.tickets = [];
      $scope.statusInfo = {
        statuses: {},
        totalCount: 0,
      };

      getTickets(userId);
    }
  });

  function setup(setLoading, pageNum) {
    if (Math.abs($scope.lastSetup - new Date()) < 2100) {
      return;
    }

    $scope.lastSetup = new Date();

    setLoading = _.isUndefined(setLoading) ? true : setLoading;

    $scope.user = Auth.getCurrentUser();

    if ($scope.user && $scope.user.userId) {
      getTickets($scope.user.userId, setLoading, pageNum);
    }
  }

  /**
   * Returns either true or false for whether the ticket should be shown.
   *
   * @param {Object} ticket
   * @param {String} tickFilter
   * @return {Boolean}
   */
  $scope.showTicket = function (ticket, tickFilter) {

    if ($scope.isLoading || $scope.ticketsLoading) { return false; }

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

  $scope.$watch('state.currentPage', function (currentPage, prevPage) {
    // return early if they are the same
    if (currentPage === prevPage) { return; }

    // No user yet
    if (!Auth.getCurrentUser()) { return; }

    getTickets(Auth.getCurrentUser().userId, false, currentPage);
  });

}]);

})();
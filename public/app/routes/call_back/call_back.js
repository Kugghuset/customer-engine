(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.admin.call_back', {
    url: '/call-back?isClosed',
    templateUrl: 'routes/call_back/call_back.html',
    controller: 'CallBackCtrl',
    title: 'Admin | Call back'
  });
}])
.controller('CallBackCtrl', ['$scope', '$timeout', '$location', 'Ticket', 'Notification', 'CallBack',
function ($scope, $timeout, $location, Ticket, Notification, CallBack) {

  $scope.npsTickets = [];
  $scope.ticketCount = 0;
  $scope.isLoading = true;
  $scope.state = {
    currentPage: 1
  };
  $scope.callBack = CallBack;

  /**
   * Gets the npsTickets from DB.
   */
  function getNpsTickets(pageNum, isClosed, options, loading) {
    $scope.isLoading = _.isUndefined(loading)
      ? true
      : loading;

    isClosed = _.isUndefined(isClosed)
      ? false
      : isClosed;

    pageNum = _.isUndefined(pageNum)
      ? 1
      : pageNum;

    Ticket.getNpsTickets(50, pageNum, _.assign({}, options, { isClosed: isClosed }))
    .then(function (data) {
      $scope.npsTickets = data.tickets;
      $scope.ticketCount = data.ticketCount;
      $scope.isLoading = false;
    })
    ['catch'](function (err) {
      $scope.isLoading = false;
      console.log(err);
      Notification.error('Couldn\'t get tickets from DB, refresh the page.')
    });
  }

  /**
   * Watch for changes in current page
   */
  $scope.$watch('state.currentPage', function (currentPage, prevPage) {
    // return early if they are the same
    if (currentPage === prevPage) { return; }

    getNpsTickets(currentPage, $location.search().isClosed, CallBack.getOptions(), true)
  });

  $scope.$watch('callBack.getOptions()', function (options, oldOptions) {
    getNpsTickets($scope.currentPage, $location.search().isClosed, options, true);
  });

  getNpsTickets($scope.currentPage, $location.search().isClosed, CallBack.getOptions());

}]);

})();
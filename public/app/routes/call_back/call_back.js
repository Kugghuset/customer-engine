(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.admin.call_back', {
    url: '/call-back',
    templateUrl: 'routes/call_back/call_back.html',
    controller: 'CallBackCtrl',
    title: 'Admin | Call back'
  });
}])
.controller('CallBackCtrl', ['$scope', '$timeout', 'Ticket',
function ($scope, $timeout, Ticket) {
  
  $scope.npsTickets = [];
  $scope.ticketCount = 0;
  $scope.isLoading = true;
  $scope.state = {
    currentPage: 1
  };
  
  /**
   * Gets the npsTickets from DB.
   */
  function getNpsTickets(pageNum, loading) {
    $scope.isLoading = _.isUndefined(loading)
      ? true
      : loading;
    
    pageNum = _.isUndefined(pageNum)
      ? 1
      : pageNum;
    
    Ticket.getNpsTickets(20, pageNum)
    .then(function (data) {
      $scope.npsTickets = data.tickets;
      $scope.ticketCount = data.ticketCount;
      $scope.isLoading = false;
      console.log(data);
    })
    ['catch'](function (err) {
      $scope.isLoading = false;
      console.log(err);
    });
  }
  
  /**
   * Watch for changes in current page
   */
  $scope.$watch('state.currentPage', function (currentPage, prevPage) {
    // return early if they are the same
    if (currentPage === prevPage) { return; }
    
    getNpsTickets(currentPage, true)
  });
  
  getNpsTickets($scope.currentPage);
  
}]);

})();
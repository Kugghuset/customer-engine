(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.create_ticket', {
    url: '/ticket/:ticketId',
    templateUrl: 'routes/create_ticket/create_ticket.html',
    controller: 'CreateTicketCtrl',
    title: 'Ticket'
  });
}])
.controller('CreateTicketCtrl', ['$scope', '$stateParams', '$location', 'Auth', 'Ticket', function ($scope, $stateParams, $location, Auth, Ticket) {
  
  $scope.currentTicketId = $stateParams.ticketId;
  
  $scope.auth = Auth;
  $scope.user = Auth.getCurrentUser();
  
  // $scope.noTickets = function (ticketId, related) {
  //   return !_.some(related, function (t) {
  //     if (!t || t.ticketId === ticketId || t.hide) { return true; }
  //     return false;
  //   })
  // }
  
  /**
   * Watches for changes in the user and sets the value of the scoped user.
   */
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
  });
  
}]);

})();
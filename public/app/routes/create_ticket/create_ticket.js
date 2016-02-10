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
.controller('CreateTicketCtrl', ['$rootScope', '$scope', '$timeout', '$stateParams', '$location', 'Auth', 'Ticket',
function ($rootScope, $scope, $timeout, $stateParams, $location, Auth, Ticket) {
  
  $scope.currentTicketId = $stateParams.ticketId;
  
  $scope.auth = Auth;
  $scope.user = Auth.getCurrentUser();
  
  $scope.state = {
    currentPage: 1
  };
  
  /**
   * Watches for changes in the user and sets the value of the scoped user.
   */
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
  });
  
  $scope.$watch('currentTicketId', function (ticketId, oldTicketId) {
    if (!_.isUndefined(ticketId) && !_.isUndefined(oldTicketId)) {
      $rootScope.title = 'Ticket ' + ticketId
      $location.replace();
    }
  })
  
}]);

})();
(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.create_ticket', {
    url: '/ticket/:ticketId',
    templateUrl: 'app/routes/create_ticket/create_ticket.html',
    controller: 'CreateTicketCtrl'
  });
}])
.controller('CreateTicketCtrl', ['$scope', '$stateParams', '$location', 'Auth', 'Ticket', function ($scope, $stateParams, $location, Auth, Ticket) {
  
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
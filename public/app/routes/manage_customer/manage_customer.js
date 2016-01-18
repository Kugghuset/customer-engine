(function () {
'use strict'

angular.module('ticketyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.customer', {
    url: '/customer',
    templateUrl: 'routes/manage_customer/manage_customer.html',
    controller: 'CustomerCtrl',
    title: 'Customer'
  });
}])
.controller('CustomerCtrl', ['$scope', '$timeout', 'Auth', 'Customer', function ($scope, $timeout, Auth, Customer) {
  
  console.log('Good job!');
  
}]);

})();
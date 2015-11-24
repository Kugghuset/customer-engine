(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.home', {
    url: '/hem',
    templateUrl: 'app/routes/home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', 'Auth', 'Customer', 'Country', 'Notification', 'Ticket', function ($scope, Auth, Customer, Country, Notification, Ticket) {
  
  $scope.user = {};
  $scope.auth = Auth;
  
  $scope.ticket = {
    ticketDate: new Date(),
    user: Auth.getCurrentUser()
  }
  
  $scope.getCustomer = function (val) {
    // Get customer based on org. number or name
    return Customer.getFuzzy(val);
  }
  
  /**
   * @param {Object} (Customer)
   * @return {String}
   */
  $scope.matched = function (customer) {
    return _.chain(customer)
      .filter(function (v, key) { return key != 'customerId' })
      .map(function (value) { return value; })
      .filter() // Remove empty posts
      .value()
      .join(', ');
  }
  
  $scope.countries = Country.getNames();
  
  $scope.categories = [
    { categoryId: 1, name: 'Acquiring' },
    { categoryId: 2, name: 'ECommerce' },
    { categoryId: 3, name: 'Invoice' },
    { categoryId: 4, name: 'Conact information' },
    { categoryId: 5, name: 'Terminations' },
    { categoryId: 6, name: 'Terminal' },
    { categoryId: 7, name: 'Orders' },
    { categoryId: 8, name: 'BAX' }
  ];
  
  $scope.datepickerOptions = {
    // add something?
  };
  
  $scope.submit = function (_ticket) {
    
    Ticket.create(_.assign({}, _ticket, { user: Auth.getCurrentUser() }))
    .then(function (ticket) {
      Notification('Ticket submitted');
      
      $scope.ticket = {
        ticketDate: new Date(),
        user: Auth.getCurrentUser()
      }
    })
    ['catch'](function (err) {
      console.log(err);
    });
  };
}]);

})();
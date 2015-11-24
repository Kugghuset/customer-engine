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
    { categoryId: 2, name: 'E-Commerce' },
    { categoryId: 3, name: 'Invoice' },
    { categoryId: 4, name: 'Contact information' },
    { categoryId: 5, name: 'Terminations' },
    { categoryId: 6, name: 'Terminal' },
    { categoryId: 7, name: 'Orders' },
    { categoryId: 8, name: 'BAX' }
  ];
  
  $scope.subcategories = {
    1: [ // categoryId: 1
      { subcategoryId: 1, name: 'Change of adress', categoryId: 1 },
      { subcategoryId: 2, name: 'Stickers', categoryId: 1 },
      { subcategoryId: 3, name: 'Reservation', categoryId: 1 },
      { subcategoryId: 4, name: 'Transaction', categoryId: 1 },
      { subcategoryId: 5, name: 'Card acceptance', categoryId: 1 },
      { subcategoryId: 6, name: 'Reports', categoryId: 1 },
      { subcategoryId: 7, name: 'Change of company', categoryId: 1 },
      { subcategoryId: 8, name: 'General problems/questions', categoryId: 1 },
      { subcategoryId: 9, name: 'Deposit', categoryId: 1 }
    ],
    2: [ // categoryId: 2
      { subcategoryId: 10, name: 'Transactions', categoryId: 2 },
      { subcategoryId: 11, name: 'Account', categoryId: 2 }
    ],
    3: [ // categoryId: 3
      { subcategoryId: 12, name: 'Change of adress', categoryId: 3 },
      { subcategoryId: 13, name: 'Invoice questions', categoryId: 3 },
      { subcategoryId: 14, name: 'Credit', categoryId: 3 },
      { subcategoryId: 15, name: 'Reject payment', categoryId: 3 }
    ],
    6: [ // categoryId: 6
      { subcategoryId: 17, name: 'Transactions', categoryId: 6 },
      { subcategoryId: 18, name: 'Reports', categoryId: 6 },
      { subcategoryId: 19, name: 'Repairs', categoryId: 6 },
      { subcategoryId: 20, name: 'SW update', categoryId: 6 },
      { subcategoryId: 21, name: 'Incompatible licence', categoryId: 6 },
      { subcategoryId: 22, name: 'Technical issues', categoryId: 6 },
      { subcategoryId: 23, name: 'Returns', categoryId: 6 }
    ],
    7: [ // categoryId: 7
      { subcategoryId: 24, name: 'Device', categoryId: 7 },
      { subcategoryId: 25, name: 'Bambora One', categoryId: 7 },
      { subcategoryId: 26, name: 'Acceptance', categoryId: 7 }
    ],
    8: [ // categoryId: 8
      { subcategoryId: 27, name: 'Application', categoryId: 8 },
      { subcategoryId: 28, name: 'Activation', categoryId: 8 }
    ]
  };
  
  $scope.descriptors = {
    8: [ // subcategoryId: 8
      { descriptorId: 1, name: 'Account setup', subcategoryId: 8 }
    ],
    11: [ // subcategoryId: 11
      { descriptorId: 2, name: 'Implementation', subcategoryId: 11 },
      { descriptorId: 3, name: 'Test', subcategoryId: 11 },
      { descriptorId: 4, name: 'webmanager', subcategoryId: 11 },
      { descriptorId: 5, name: 'Set-up', subcategoryId: 11 }
    ],
    17: [ // subcategoryId: 17
      { descriptorId: 6, name: 'Refund', subcategoryId: 17 },
      { descriptorId: 7, name: 'Gerneral transaction problems', subcategoryId: 17 },
    ],
    18: [ // subcategoryId: 18
      { descriptorId: 8, name: 'S&R', subcategoryId: 18 },
      { descriptorId: 9, name: 'DOA', subcategoryId: 18 },
      { descriptorId: 10, name: 'Swap service', subcategoryId: 18 },
      { descriptorId: 11, name: 'General', subcategoryId: 18 }
    ],
    22: [ // subcategoryId: 22
      { descriptorId: 12, name: 'Communication problems', subcategoryId: 22 },
      { descriptorId: 13, name: 'Printer problems', subcategoryId: 22 },
      { descriptorId: 14, name: 'Blue screen', subcategoryId: 22 },
      { descriptorId: 15, name: 'Chip reader', subcategoryId: 22 },
      { descriptorId: 16, name: 'Terminal settings', subcategoryId: 22 },
      { descriptorId: 17, name: 'Power problems', subcategoryId: 22 }
    ],
    26: [ // subcategoryId: 26
      { descriptorId: 18, name: 'Cross sell', subcategoryId: 26 }
    ]
  }
  
  $scope.datepickerOptions = {
    // add something?
  };
  
  // Submits a ticket to the system.
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
  
  // Watches for changes in user :)
  $scope.$watch('auth.getCurrentUser()', function (user) {
    $scope.user = user;
  })
}]);

})();
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
.controller('HomeCtrl', ['$scope', 'Auth', function ($scope, Auth) {
  
  $scope.user = {};
  $scope.auth = Auth;
  
  /**
    * @param {Object} _user
    */
  $scope.login = function (_user) {
    Auth.login(_user)
    .then(function (user) {
      console.log(user);
      $scope.user = user;
    })
    ['catch'](function (err) {
      console.log(err);
    });
  }
}]);

})();
(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main', {
    templateUrl: 'app/routes/main.html',
    controller: 'MainCtrl'
  });
}])
.controller('MainCtrl', ['$scope', 'Auth', function ($scope, Auth) {
  $scope.auth = Auth;
  
  $scope.login = function (_user) {
    Auth.login(_user)
    .then(function (user) {
      _user = {};
    })
    ['catch'](function (err) {
      console.log(err);
    });
  }
  
}]);

})();
(function () {
'use strict'

angular.module('customerEngineApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main', {
    templateUrl: 'app/routes/main.html',
    controller: 'MainCtrl'
  });
}])
.controller('MainCtrl', ['$scope', 'Auth', 'Notification', function ($scope, Auth, Notification) {
  $scope.auth = Auth;
  
  $scope.login = function (_user) {
    Auth.login(_user)
    .then(function (user) {
      _user = {};
    })
    ['catch'](function (err) {
      Notification.error('Something went wrong...')
      console.log(err);
    });
  }
  
}]);

})();
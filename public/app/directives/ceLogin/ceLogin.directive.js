(function () {
'use strict'

angular.module('customerEngineApp')
.directive('ceLogin', ['$location', 'Auth', 'Notification', function ($location, Auth, Notification) {
  return {
    templateUrl: 'app/directives/ceLogin/ceLogin.html',
    restrict : 'EA',
    scope: {
      user: '='
    },
    link: function (scope, element, attrs) {
      
      scope.tempUser = {};
      
      scope.emailExists = false;
      
      /**
       * Attempts to log the user in.
       * 
       * @param {Object} _user
       */
      scope.login = function (loginForm, _user) {
        
        // Ensure login can be peformed.
        if (!scope.formValid(loginForm, _user)) { return; }
        
        Auth.login(_user)
        .then(function (user) {
          _user = {};
          if (user.isNew) {
            Notification.success('New user created');
          }
          $location.path('/dashboard');
        })
        ['catch'](function (err) {
          
          if (/incorrect password|email is required|password is required/i.test(err)) {
            Notification.error(err);
          } else {
            Notification.error('Could\'t log in.');
          }
        })
      }
      
      /**
       * @param {Object} loginForm (Form object)
       * @param {Object} user
       * @return {Boolean}
       */
      scope.formValid = function (loginForm, user) {
        if (!user) { return false; }
        
        return _.every([
          loginForm.email.$valid,
          user.email && user.email.length
        ]);
      }
      
    }
  }
}]);

})();
(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Auth', ['$http', '$q', '$cookies', function ($http, $q, $cookies) {
  var _user;
  
  /**
   * Returns a promise of the logged in user, if any.
   * 
   * @return {Promise} -> {User} (User)
   */
  function getMe() {
    return $q(function (resolve, reject) {
      $http.get('/api/users/me')
      .success(resolve)
      .error(reject);
    });
  }
  
  return {
    /**
     * Returns true or false for whether there is a token,
     * which probably means there is a user.
     * 
     * If there is a token, it runs getMe to populate it.
     * 
     * @return {Promise} -> {Boolean}
     */
    isLoggedInAsync: function () {
      return $q(function (resolve, reject) {
        if ($cookies.get('token')) {
          // Enough for transition to progress
          resolve(true);
          
          // Still, populate the user
          getMe().then(function (user) {
            _user = user;
          })
          ['catch'](function (err) { });
        } else {
          _user = {};
          resolve(false);
        }
      });
    },
    /**
     * Gets the local user.
     * 
     * @return {Objec} (User)
     */
    getCurrentUser: function () {
      return _user;
    },
    
    /**
     * Logs in the user.
     * If the user doesn't exist, it will create a new one.
     * 
     * @param {Object} user (User)
     * @return {Promise} -> {Object} (User)
     */
    login: function (__user) {
      return $q(function (resolve, reject) {
        $http({
          method: 'PUT',
          url: '/api/users',
          data: __user
        }).then(function successCallback(response) {
          
          _user = response.data;
          resolve(response.data);
      }, function errorCallback(response) {
        reject(response.data);
      });
      });
    }
  }
}]);

})();
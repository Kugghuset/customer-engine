(function () {
'use strict'

angular.module('ticketyApp')
.factory('Auth', ['$rootScope', '$http', '$q', '$cookies', '$state', function ($rootScope, $http, $q, $cookies, $state) {
  var _user;
  var _users;

  /**
   * Watches the variable *_user* for changes.
   * If *newUser* is an empty object and *oldUser* is not,
   * the app transitions to login.
   */
  $rootScope.$watch(function () {
    return _user;
  }, function (newUser, oldUser) {
    if (_.isEqual({}, newUser) && !_.isEqual({}, oldUser)) {
      $state.transitionTo('main.login');
    }
  });

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
     * @param {Boolean} resolveUser
     * @return {Promise} -> {Boolean}
     */
    isLoggedInAsync: function (resolveUser) {
      return $q(function (resolve, reject) {
        if ($cookies.get('token')) {
          // Enough for transition to progress
          if (!resolveUser) {
            resolve(true);
          }

          // Still, populate the user
          getMe().then(function (user) {
            _user = user;
            resolve(_user);
          })
          ['catch'](function (err) { });
        } else {
          _user = {};
          resolve(false);
        }
      });
    },

    isLoggedIn: function () {
      return !!$cookies.get('token')
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
     * @param {Object} user (User)
     */
    setCurrentUser: function (user) {
      _user = user;
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
    },
    /**
     * Sets _user to empty
     * and removes the token from cookies.
     */
    logout: function () {
      _user = {};
      $cookies.remove('token');
    },

    /**
     * Updates the user.
     *
     * @param {Object} _user (User)
     * @return {Promise} -> {Object} (User)
     */
    update: function (_user) {
      return $q(function (resolve, reject) {
        $http.put('/api/users/' + _user.userId, _user)
        .success(resolve)
        .error(reject);
      });
    },

    /**
     * Updates the current user's password
     * in the DB.
     *
     * @param {Object} passObj
     * @return {Promise}
     */
    setPassword: function (userId, passObj) {
      return $q(function (resolve, reject) {
        $http.put('/api/users/' + userId + '/password', passObj)
        .success(resolve)
        .error(reject);
      });
    },

    /**
     * Gets all users from DB.
     *
     * @return {Promise} -> {Array}
     */
    getAll: function () {
      return $q(function (resolve, reject) {

        // Use cached users if _users is defined
        if (_users) {
          return resolve(_users);
        }

        $http.get('api/users/')
        .success(function (data) {
          _users = data;
          resolve(data);
        })
        .error(reject);
      });
    },

    getFuzzy: function (fuzzy) {
      return $q(function (resolve, reject) {
        // Ensure it's encoded
        var _fuzzy = encodeURIComponent(fuzzy);

        $http.get('api/users/fuzzy?fuzz=' + _fuzzy)
        .success(resolve)
        .catch(reject);
      });
    },

    getOther: function (otherId) {
      return $q(function (resolve, reject) {
        $http.get('api/users/as-other/' + otherId)
        .success(resolve)
        .catch(reject);
      });
    },
  }
}]);

})();
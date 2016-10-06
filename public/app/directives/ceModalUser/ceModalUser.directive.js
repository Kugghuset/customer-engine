(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalUser', ['$uibModal', '$q', 'Auth', 'Department', 'Notification', function ($uibModal, $q, Auth, Department, Notification) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '='
    },
    link: function (scope, element, attrs, ctrl) {

      var modalInstance;

      scope.openModal = function (user) {

        modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'directives/ceModalUser/ceModalUser.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            $q: function () {
              return $q;
            },
            user: function () {
              return user;
            },
            Auth: function () {
              return Auth;
            },
            Department: function () {
              return Department;
            },
            Notification: function () {
              return Notification;
            },
            users: function () {
              return user.role >= 100 ? Auth.getAll() : [];
            },
          }
        });

        modalInstance.result.then(function (user) {
          if (!user) { return; } // early
          Auth.setCurrentUser(user);
        }, function () {
          // Something absolutely went horribly wrong!
        });
      };

      scope.$on('$destroy', function (event) {
        if (modalInstance) {
          modalInstance.close();
        }
      });

    }
  }
}])
.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', '$q', 'user', 'Auth', 'Department', 'Notification', 'users',
  function ($scope, $uibModalInstance, $q, user, Auth, Department, Notification, users) {

  var allowClose = false;

  $scope.savedName = !!user.name;

  $scope.original;
  $scope.user;
  $scope.loadingUser;
  $scope.loadingPassword;

  // Setup
  setLocalUser(user);
  getDepartments();

  $scope.loadingOther = false;
  $scope.otherUser = undefined;
  $scope._users = users;

  $scope.loadingActualUser = false;

  $scope.hasLongToken = function () {
    return Auth.getIsLongToken();
  }

  $scope.getActualUser = function () {
    $scope.loadingActualUser = true;
    $q.all([
      Auth.getActualUser(),
      Auth.getAll(),
    ])
    .then(function (res) {
      var _user = res[0];
      $scope.loadingActualUser = false;
      Notification.success('Logged in as actual user.');

      setLocalUser(_user);
      Auth.setCurrentUser(_user);

      $scope._users = res[1];
    })
    .catch(function (err) {
      $scope.loadingActualUser = false;

      Notification.error('Failed to log in as actual user.');

      console.log(err);
    });
  }

  $scope.setOtherUser = function (_user) {
    $scope.otherUser = _user;
  }

  $scope.applyOtherUser = function (_otherUserId) {
    $scope.loadingOther = true;

    Auth.getOther(_otherUserId)
    .then(function (_user) {
      $scope.loadingOther = false;
      Notification.success('Logged in as other user.');

      setLocalUser(_user);
      Auth.setCurrentUser(_user);
    })
    .catch(function (err) {
      $scope.loadingOther = false;

      Notification.error('Failed to log in as other user.');

      console.log(err);
    });
  }

  /**
   * Copys _user onto $scope.original and $scope.user
   * and returns a copy of _user;
   *
   * @param {Object} _user
   * @return {Object}
   */
  function setLocalUser(_user) {
    // Keep a copy of the user for further use
    $scope.original = angular.copy(_user);
    // assign $scope to a copy of user, as it's regarded as a service and we don't want to by mistake modify it.
    $scope.user = angular.copy(_user);

    return angular.copy(_user);
  }

  /**
    * Gets all departments and attaches them to $scope.
    */
  function getDepartments() {
    Department.getAll()
    .then(function (departments) {
      $scope.departments = departments;
    })
    ['catch'](function (err) {
      Notification.error('Something went wrong with fetching the departments, please refresh the page.')
    });
  }

  /**
   * Updates the user in the DB.
   */
  $scope.ok = function () {
    if (!$scope.canUpdateUser($scope.user)) {
      return; // earlu
    }
    $scope.loadingUser = true;
    Auth.update($scope.user)
    .then(function (_user) {
      $scope.savedName = !!_user.name;
      setLocalUser(_user);
      Notification.success('User updated.');
      $scope.loadingUser = false;
    })
    ['catch'](function (err) {
      $scope.loadingUser = false;
      if (/email/gi.test(err)) {
        Notification.error(err);
      } else {
        Notification.error('Something went wrong.')
      }
    })
  };

  /**
   * Closes the modal and returns the original user
   * (which should match the user in the DB)
   */
  $scope.cancel = function () {
    allowClose = true;
    $uibModalInstance.close($scope.original);
  };

  /**
   * Returns true or false for whether the user
   * matches the original one and whether there is a name and email.
   *
   * @param {Object} user
   * @return {Boolean}
   */
  $scope.canUpdateUser = function (user) {
    return _.every([
      user && user.name,
      _.some([
        user.name != $scope.original.name,
        user.email && user.email != $scope.original.email,
        _.some([
          user.department && !$scope.original.department,
          !user.department && $scope.original.department,
          user.department && $scope.original.department && user.department.departmentName != $scope.original.department.departmentName
        ])
      ])
    ]);
  }

  /**
   * Returns true or false for whether there are any passwords
   * and the new and repeated password exists.
   *
   * @param {Object} passObj { current: String, new: String, repeat: String }
   * @return {Boolean}
   */
  $scope.canUpdatePassword = function (passObj) {
    if (!passObj) { return false; }

    return _.every([
      passObj.current,
      passObj.new,
      passObj.new === passObj.repeat
    ]);
  }

  /**
   * If the passwords match, updates the password in the DB.
   *
   * @param {Object} passObj
   */
  $scope.updatePassword = function (passObj) {
    if (!$scope.canUpdatePassword(passObj)) {
      return; // early
    }

    $scope.loadingPassword = true;

    Auth.setPassword($scope.user.userId, passObj)
    .then(function (res) {
      $scope.loadingPassword = false;
      $scope.password = {
        current: '',
        new: '',
        repeat: ''
      }
      Notification.success('Password successfully updated.');
    })
    .catch(function (err) {
      $scope.loadingPassword = false;
      Notification.error(
        /password/gi.test(err)
        ? err
        : 'Could not update the password. Something went wrong.'
      );
    });
  }

  /**
   * Subsrcibes to the closing event
   * and disallows it if the user has no name,
   * or passes the close event through to the close function
   * to ensure the updated user is returned.
   */
  $scope.$on('modal.closing', function (event) {
    if (!$scope.savedName) {
      allowClose = false;
      event.preventDefault();
    } else if (!allowClose) {
      event.preventDefault();
      $scope.cancel();
    }
  });

}]);

})();
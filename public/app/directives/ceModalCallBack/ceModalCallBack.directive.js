(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalCallBack', ['$uibModal', '$timeout', 'Auth', 'Notification', function ($uibModal, $timeout, Auth, Notification) {
  return {
    template: '<div></div>',
    restrict : 'EA',
    scope: {
      openModal: '=',
      modalIsOpen: '=',
      npsTicket: '=',
      users: '='
    },
    link: function (scope, element, attrs, ctrl) {
      
      var modalInstance;
      
      scope.openModal = function (ticket) {
        
        if (scope.modalIsOpen) {
          // Only one instance can be open.
          return;
        }
        
        $timeout(function () {
          scope.modalIsOpen = true;
        });
        
        modalInstance = $uibModal.open({
          animation: true,
          size: 'lg',
          templateUrl: 'directives/ceModalCallBack/ceModalCallBack.html',
          controller: 'ConfirmModalInstanceCtrl',
          resolve: {
            ticket: function () {
              return ticket;
            },
            users: function () {
              if (scope.users && scope.users.length) {
                return scope.users;
              } else {
                return Auth.getAll();
              }
            }
          }
        });
        
        // Set the confirm result
        modalInstance.result.then(function (_ticket) {
          $timeout(function () {
            ticket = ghettoMerge(ticket, _ticket, '$$hashKey')
            Notification.success('Ticket number :id saved.'.replace(':id', ticket.ticketId))
            scope.modalIsOpen = false;
          });
        })
        ['catch'](function (res) {
          $timeout(function () {
            scope.modalIsOpen = false;
          });
        });
      };
      
      /**
       * @param {Object} oldObj
       * @param {Object} newObj
       * @param {String|Array} skip
       * @return {Object}
       */
      function ghettoMerge(oldObj, newObj, skip) {
        _.forEach(_.omit(newObj, skip), function (value, key) {
          oldObj[key] = value;
        });
        
        return oldObj;
      }
      
      scope.$on('$destroy', function (event) {
        if (modalInstance) {
          modalInstance.close();
        }
      });
      
    }
  }
}])
.controller('ConfirmModalInstanceCtrl', ['$scope', '$uibModalInstance', 'CallBack', 'Notification', 'ticket', 'users',
  function ($scope, $uibModalInstance, CallBack, Notification, ticket, users) {
  
  $scope.ticket = angular.copy(ticket);
  $scope.users = users;
  
  /**
   * Saves and closes the 
   */
  $scope.save = function () {
    
    if (!$scope.ticket || !$scope.ticket.callBack) { return $uibModalInstance.close({}); }
    
    var callBackObj = _.assign({}, $scope.ticket.callBack, {
      ticketId: $scope.ticket.ticketId,
      userId: $scope.ticket.callBack.userId
    });
    
    CallBack.set(callBackObj.callBackId, callBackObj)
    .then(function (ticket) {
      $uibModalInstance.close(ticket);
    })
    ['catch'](function (err) {
      $uibModalInstance.dismiss(false);
    });
  };
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss(false);
  }
  
  $scope.handleAgentChanged = function (event, agentName, user) {
    
    if (event && event.keyCode === 13) {
      $scope.setUser(agentName);
    }
  }
  
  /**
   * Return true or false for whether *agentName*
   * matches either *user*.name or *user*.email.
   * 
   * @param {String} agentName
   * @param {Object} user
   * @return {Boolean}
   */
  function agentIsUser(agentName, user) {
    return (!!agentName && user && (user.name || user.email) === agentName);
  }
  
  /**
   * Sets the user object and agentName to user (and user.name).
   * 
   * @param {Object} input§
   */
  $scope.setUser = function (input) {
    var user;
    var agentName;
    if (_.isString(input)) {
      agentName = input;
    } else {
      user = input;
      agentName = !!user
        ? user.name || user.email
        : user;
    }
    
    if (agentIsUser(agentName, _.get($scope.ticket, 'callBack.user'))) {
      return;
    }
    
    if ($scope.ticket) {
      // Assign the callBack object to itself and the new data
      $scope.ticket.callBack = _.assign({}, $scope.ticket.callBack, {
        user: user,
        agentName: agentName
      });
    } else {
      Notification.error('Cannot assign user to non-existant ticket.');
    }
  }
  
  /**
   * Splits the comment on new lines after converting \\n to \n.
   * 
   * @param {String} comment
   * @return {Array}
   */
  $scope.splitComments = function (comment, splitter) {
    
    splitter = _.isUndefined(splitter) ? '\n' : splitter;
    
    return !_.isString(comment)
      ? []
      : comment.replace(/\\n/g, '\n').split(new RegExp(splitter));
  };
  
  $scope.statuses = CallBack.getStatuses();
  $scope.promoteReasons = CallBack.getPromoteReasons();
  $scope.detractReasons = CallBack.getDetractReasons();
  
  /**
   * Watch for changes in callBack.agentName and set the user if it's changed.
   */
  $scope.$watch('ticket.callBack.agentName', function (agentName, oldName) {
    if (agentName === oldName) { return; }
    
    if (!agentName) {
      $scope.setUser(undefined);
    } else if (!!$scope.ticket.callBack.user && agentName === $scope.ticket.callBack.user.name) {
      return;
    } else {
      $scope.setUser(agentName);
    }
    
  });
  
}]);

})();
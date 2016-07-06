(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceModalCallBack',
['$uibModal', '$timeout', 'Auth', 'CallBack', 'Notification',
function ($uibModal, $timeout, Auth, CallBack, Notification) {
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
          controller: 'CallBackModalInstanceCtrl',
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
            },
            statuses: CallBack.getStatuses,
            reasonsToPromote: CallBack.getReasonsToPromote,
            reasonsToDetract: CallBack.getReasonsToDetract
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
.controller('CallBackModalInstanceCtrl',
['$scope', '$uibModalInstance', 'CallBack', 'Notification', 'ticket', 'users', 'statuses', 'reasonsToPromote', 'reasonsToDetract',
function ($scope, $uibModalInstance, CallBack, Notification, ticket, users, statuses, reasonsToPromote, reasonsToDetract) {
  
  $scope.ticket = angular.copy(ticket);
  $scope.users = users;

  $scope.statuses = statuses;
  $scope.promoteReasons = reasonsToPromote;
  $scope.detractReasons = reasonsToDetract;
  
  $scope.manualClose;
  
  /**
   * Saves and closes the 
   */
  $scope.save = function () {
    
    if (!$scope.ticket || !$scope.ticket.callBack) { return $uibModalInstance.close({}); }
    
    var callBackObj = _.assign({}, $scope.ticket.callBack, {
      ticketId: $scope.ticket.ticketId,
      userId: $scope.ticket.callBack.userId,
      npsId: $scope.ticket.nps.npsId,
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
  
  /**
   * Sets the call back status of the ticket.
   * Will also set isClosed, see comment in code.
   * 
   * @param {Object} status
   */
  $scope.setCallBackStatus = function (status) {
    
    // Set callBack.isClosed either to true if status.shouldClose is true,
    // or to status.shouldClose if manualClose isn't truthy.
    if (status.shouldClose) {
      $scope.ticket.callBack.isClosed = true;
    } else if (!$scope.manualClose) {
      $scope.ticket.callBack.isClosed = status.shouldClose;
    }
    
    $scope.ticket.callBack.callBackStatus = status.callBackStatusName;
  }
  
  /**
   * @param {Object} reason
   * @param {Number} num Should be either 1 or 2.
   */
  $scope.setReasonToPromote = function (reason, num) {
    $scope.ticket.callBack['reasonToPromote' + num] = reason.reasonToPromoteName;
  }
  
  /**
   * @param {Object} reason
   * @param {Number} num Should be either 1 or 2.
   */
  $scope.setReasonToDetract = function (reason, num) {
    $scope.ticket.callBack['reasonToDetract' + num] = reason.reasonToDetractName;
  }
  
  /**
   * Watch for changes in the isCLosed status, and set dateClosed
   */
  $scope.$watch('ticket.callBack.isClosed', function (isClosed, oldIsClosed) {
    // Set the dateClosed either to now, if the status changed to closed, 
    // or undefined if it's open.
    if (oldIsClosed != isClosed) {
      $scope.ticket.callBack.dateClosed = $scope.ticket.callBack.isClosed
        ? new Date()
        : undefined;
    }
  })
  
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

  $scope.$watch('ticket.callBack.postCallBackNpscScore', function (num, oldNum) {
    if (typeof num === 'undefined') {
      return;
    }
    
    if (typeof num !== 'number') {
      $scope.ticket.callBack.postCallBackNpscScore = undefined;
      return;
    }

    if (num < 0) {
      $scope.ticket.callBack.postCallBackNpscScore = 0;
    } else if (num > 10) {
      $scope.ticket.callBack.postCallBackNpscScore = 10;
    }

    console.log()
  });
  
}]);

})();
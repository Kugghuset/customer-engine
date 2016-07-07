(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceCallBackGrid', ['$location', 'Ticket', 'Auth', 'CallBack', 'Notification', function ($location, Ticket, Auth, CallBack, Notification) {
  return {
    templateUrl: 'directives/ceCallBackGrid/ceCallBackGrid.html',
    restrict: 'EA',
    scope: {
      tickets: '='
    },
    link: function (scope, element, attrs) {
      
      function getStatusOfPage() {
        return /false/.test(($location.search() || {}).isClosed)
          ? false
          : true;
      }

      scope.users = [];

      // Set up scope.users.
      Auth.getAll()
      .then(function (users) {
        scope.users = users;
      })
      .catch(function (err) {
        console.log(err);
      });
      
      /**
       * Splits the comment on new lines after converting \\n to \n.
       * 
       * @param {String} comment
       * @return {Array}
       */
      scope.splitComments = function (comment, splitter) {
        
        splitter = _.isUndefined(splitter) ? '\n' : splitter;
        
        return !_.isString(comment)
          ? []
          : comment.replace(/\\n/g, '\n').split(new RegExp(splitter));
      };
      
      /**
       * Gets the sort array for using the alpha sort module.
       * 
       * @return {Array}
       */
      scope.getSort = function () {
        return getStatusOfPage()
          ? ['callBack.dateClosed', 'ticketId']
          : ['nps.npsDate', 'nps.npsScore'];
          
      };
      
      /**
       * Returns true or false for whether the object should be hidden or not.
       * 
       * @param {Object} ticket
       * @return {Boolean}
       */
      scope.shouldHide = function (ticket) {
        return getStatusOfPage() != !!_.get(ticket, 'callBack.isClosed');
      };

      scope.setUser = function (ticket, $item) {
        ticket.callBack._user = _.isObject($item) ? $item : undefined;
        ticket.callBack._agentName = _.isObject($item)
          ? $item.name || $item.email
          : undefined;
      }

      /**
       * Saves the CallBack object to DB.
       * 
       * @param {Object} ticket
       */
      scope.saveCallBack = function (ticket) {
        // Set the agent name from the temporary _agentName
        _.set(ticket, 'callBack.agentName', _.get(ticket, 'callBack._agentName'));

        // Set the callBack user to the temporary _user if there is an agentName
        _.set(ticket, 'callBack.user', (
            !!_.get(ticket, 'callBack.agentName')
              ? _.get(ticket, 'callBack._user')
              : undefined
        ));

        // Get the callBackId
        var _callBackId = _.get(ticket, 'callBack.callBackId');

        // Get the callBack object to save to DB.
        var _callBack = _.assign({}, ticket.callBack, {
          ticketId: _.get(ticket.ticketId),
          npsId: _.get(ticket, 'nps.npsId'),
          userId: _.get(ticket, 'callBack.user.userId'),
        });
        

        
        // Save to DB
        CallBack.set(_callBackId, _callBack)
        .then(function (data) {
          console.log(data);
          Notification.success('Call back saved.');
        })
        .catch(function (err) {
          console.log(err);
          Notification.error('Could not save call back.');
        })
      }

      scope.$watch('tickets', function (tickets, oldTickets) {
        // Populate the _user and _agentName properties of the callBack property
        _.forEach(scope.tickets, function (ticket) {
          ticket.callBack = _.assign({}, ticket.callBack, { 
            _user: _.get(ticket.callBack, 'user'),  
            _agentName: _.get(ticket.callBack, 'agentName'),
          });
        });
      });
    }
  };
}]);

})();
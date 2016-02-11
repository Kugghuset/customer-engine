(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceCallBackGrid', ['Ticket', 'Auth', function (Ticket, Auth) {
  return {
    templateUrl: 'directives/ceCallBackGrid/ceCallBackGrid.html',
    restrict: 'EA',
    scope: {
      tickets: '='
    },
    link: function (scope, element, attrs) {
      
      scope.callStatuses = [
        'Not called',
        'Call completed',
        'Call back later',
        'No reply - called several times',
        'Customer don\'t want to talk'
      ];
      
      scope.promoteReasons = [
        'Problem resolved instantly',
        'Problem solved within reasonable time',
        'Problem was resolved permanently',
        'Few problems - things generally works well',
        'Few/no transfers',
        'Feedback when problem was resolved',
        'Easy to get through / Short waiting time',
        'Friendly & professional agent',
        'High knowledge level of agent',
        'Good language capabability of agent',
        'Agent understood my problem',
        'No specific reason given',
        'Customer don\'t want to talk',
        'NPS score based on contact with someone else than Bambora Support',
        'Product or system related reason (e.g. HW/SW, reports)'
      ];
      
      scope.detractReasons = [
        'No / Poor solution to problem',
        'Long time to solve the problem',
        'The same problem keeps on coming back / Customer had to call back multiple times on the same issue',
        'Many problems overall - things don\'t work well',
        'Customer was transferred around multiple times',
        'No feedback when/if problem was resolved',
        'Hard to get through / Long waiting time',
        'Unfriendly / Unprofessional agent',
        'Low knowledge level of agent',
        'Poor language capabability of agent',
        'Agent did not understand my problem',
        'No specific reason given',
        'Customer don\'t want to talk',
        'NPS score based on contact with someone else than Bambora Support',
        'Product or system related reason (e.g. HW/SW, reports, server downtime)'
      ];
      
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
      
    }
  };
}]);

})();
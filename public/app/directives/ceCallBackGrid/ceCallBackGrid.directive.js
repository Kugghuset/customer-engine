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
(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceCallBackGrid', ['$location', 'Ticket', 'Auth', function ($location, Ticket, Auth) {
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
      
    }
  };
}]);

})();
(function () {
'use strict'

angular.module('ticketyApp')
.directive('cePaginator', ['$timeout', 'Utils', function ($timeout, Utils) {
  return {
    templateUrl: 'directives/cePaginator/cePaginator.html',
    restrict : 'EA',
    scope: {
      ticketCount: '=',
      pageSize: '=',
      state: '='
    },
    link: function (scope, element, attrs) {
      
      scope.pages = [];
      
      scope.pageSize = !_.isUndefined(scope.pageSize)
        ? scope.pageSize
        : 20;
      
      function setPages(count) {
        scope.pages = [];
        
        var i = 0;
        
        var _count = (count/scope.pageSize) % 1 === 0
          ? count/scope.pageSize
          : Math.floor(count/scope.pageSize) + 1;
        
        while(i++ < _count) {
          scope.pages.push(i);
        }
        
      }
      
      scope.setPage = function (pageNum) {
        
        if (!scope.state) { scope.state = {}; }
        
        scope.state.currentPage = pageNum;
      }
      
      scope.$watch('ticketCount', function (ticketCount, oldCount) {
        setPages(ticketCount);
      })
      
      setPages(scope.ticketCount);
      
    }
  }
}]);

})();

(function () {
'use strict'

angular.module('ticketyApp')
.directive('cePaginator', ['$timeout', 'Utils', function ($timeout, Utils) {
  return {
    templateUrl: 'directives/cePaginator/cePaginator.html',
    restrict : 'EA',
    scope: {
      ticketCount: '=',
      state: '='
    },
    link: function (scope, element, attrs) {
      
      scope.pages = [];
      
      function setPages(count) {
        scope.pages = [];
        
        var i = 0;
        
        var _count = (count/20) % 1 === 0
          ? count/20
          : Math.floor(count/20) + 1;
        
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

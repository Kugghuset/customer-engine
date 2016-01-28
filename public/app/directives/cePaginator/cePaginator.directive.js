(function () {
'use strict'

angular.module('ticketyApp')
.directive('cePaginator', ['Utils', function (Utils) {
  return {
    templateUrl: 'directives/cePaginator/cePaginator.html',
    restrict : 'EA',
    scope: {
      ticketCount: '='
    },
    link: function (scope, element, attrs) {
      
      scope.pages = [];
      
      function setPages(count) {
        scope.pages = [];
        
        var i = 0;
        
        while(i++ < count) {
          scope.pages.push(i);
        }
        
      }
      
      setPages(50);
      
    }
  }
}]);

})();

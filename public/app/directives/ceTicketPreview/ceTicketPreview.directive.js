(function () {

angular.module('customerEngineApp')
.directive('ceTicketPreview', function () {
  return {
    templateUrl: 'app/directives/ceTicketPreview/ceTicketPreview.html',
    restrict: 'EA',
    scope: {
      ticket: '='
    },
    link: function (scope, element, attrs) {
      // Add logic? nah
    }
  };
});

})();
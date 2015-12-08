(function () {

angular.module('customerEngineApp')
.directive('ceStatusSelect', function () {
  return {
    templateUrl: 'app/directives/ceStatusSelect/ceStatusSelect.html',
    restrict: 'EA',
    scope: {
      status: '=',
      isReadonly: '='
    },
    link: function (scope, element, attrs) {
      
      scope.statuses = [
        { value: 'Open' },
        { value: 'Closed' },
        { value: 'Pending' }
      ];
      
      scope.showShort = function (status) {
        var s = _.find(scope.statuses, { value: status });
        if (!s) {
          return status;
        } else {
          return s.value;
        }
      }
      
      scope.setValue = function (_status) {
        scope.status = _status.value
        // scope.$apply(function () { scope.status = _status.value });
      }
      
      scope.getColor = function (_status) {
        
        if (!_status) { return; }
        
        switch (_status) {
          case 'Open':
            return 'green';
            break;
          case 'Closed':
            return 'red';
            break;
          case 'Pending':
            return 'beige';
            break;
        
          default:
            break;
        }
      }
      
    }
  };
});

})();
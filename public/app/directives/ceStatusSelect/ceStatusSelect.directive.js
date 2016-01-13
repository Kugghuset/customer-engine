(function () {

angular.module('ticketyApp')
.directive('ceStatusSelect', function () {
  return {
    templateUrl: 'directives/ceStatusSelect/ceStatusSelect.html',
    restrict: 'EA',
    scope: {
      status: '=',
      isReadonly: '=',
      onStatusChanged: '='
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
        if (_.isFunction(scope.onStatusChanged)) {
          scope.onStatusChanged(_status.value);
        }
      }
      
      scope.getColor = function (_status) {
        
        if (!_status) { return; }
        
        switch (_status) {
          case 'Open':
            return 'purple';
            break;
          case 'Closed':
            return 'green';
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
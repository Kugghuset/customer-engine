(function () {

angular.module('ticketyApp')
.directive('ceTextAppend', ['$filter', '$parse', function ($filter, $parse) {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      
      if (!ctrl) { return; }
      
      // Works perfectly with uib-typeahead, as this will only be run when the model is changed.
      // Will append ' (Value of attrs.ceTextAppend)' to the input when edited.
      ctrl.$formatters.push(function (viewValue) {
        return (viewValue && attrs.ceTextAppend)
          ? [viewValue, ' (', $parse(attrs.ceTextAppend)(scope), ')'].join('')
          : '';
      })
      
    }
  };
}]);

})();
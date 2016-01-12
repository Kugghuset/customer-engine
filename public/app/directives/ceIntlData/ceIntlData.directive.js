/* global moment */
/* global rome */
(function () {
'use strict'

angular.module('ticketyApp')
.directive('ceIntlData', ['$timeout', 'Country', function ($timeout, Country) {
  return {
    restrict : 'A',
    scope: {
      country: '='
    },
    link: function (scope, element, attrs) {
      
      /**
       * Watches for changes in the country variable on scope.
       */
      scope.$watch('country', function (newVal, oldVal) {
        if (_.isObject(newVal)) {
          element.intlTelInput("selectCountry", newVal.short);
        }
      });
      
      /**
       * Watches for changes in the selected country data
       * from the flag dropdown.
       */
      scope.$watch(function () {
        return element.intlTelInput("getSelectedCountryData");
      }, function (newVal, oldVal) {
        // Assign the country variable to the selected country from the country list.
        scope.country = _.find(Country.getShortAndNames(), { short: newVal.iso2.toUpperCase() }) || scope.country;
      });
    }
  }
}]);

})();
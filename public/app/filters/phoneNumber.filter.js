(function () {

angular.module('customerEngineApp')
.filter('phoneNumber', function () {
  
  return function (tel, countryCode) {
    
    console.log(tel, countryCode);
    
    return intlTelInputUtils.formatNumber(
        // For some reason this will format without spaces,
        // but prepend the '+' instead
        intlTelInputUtils.formatNumberByType(tel, countryCode || 'SE')
        , 'SE');
  };
  
});

})();
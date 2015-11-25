(function () {

angular.module('customerEngineApp')
.filter('split', function () {
  
  return function (input, delimiter) {
    
    delimiter = delimiter || ',';
    
    input =  _.isString(input) ? input : '';
    
    return input.split(delimiter);
    
  };
  
});

})();
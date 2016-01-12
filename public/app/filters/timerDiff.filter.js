(function () {

angular.module('ticketyApp')
.filter('timerDiff', function () {
  
  return function (dates) {
    
    var start = dates[0];
    var stop = dates[1];
    
    var diff = moment(stop || new Date()).diff(start || new Date(), 'seconds');
    
    var isNegative = diff < 0;
    
    diff = diff < 0 ? diff * -1 : diff;
      
      var format;
      if (diff < 3600) {
        // only minutes
        format = 'mm:ss';
      } else if (diff >= 3600 && diff < 86400) {
        // hours
        format = 'hh:mm:ss';
      } else {
        // days, omg
        diff -= 86400,
        format = 'DD hh:mm:ss';
      }
      
      return (isNegative ? '- ' : '') + moment().startOf('year').add(diff, 'seconds').format(format);
  };
  
});

})();
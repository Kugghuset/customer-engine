(function () {
'use strict'

angular.module('ticketyApp')
.factory('NPS', ['$q', '$http', function ($q, $http) {
  
  return {
    
    /**
     * @return {Promise} -> {Array}
     */
    get: function () {
      return $q(function (resolve, reject) {
        
        $http.get('/api/files/')
        .success(resolve)
        .error(reject);
        
      });
      
    },
    
    /**
     * @param {Array} files
     * @return {Promise} -> {Array}
     */
    upload: function (files) {
      
      return $q(function (resolve, reject) {
        
        // Create the form data
        var data = new FormData();
        _.forEach(files, function (file, i) {
          data.append(i, file);
        })
        
        $http.post('/api/files/', data, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        })
        .success(resolve)
        .error(reject);
        
      });
      
    }
  }
  
}]);

})();

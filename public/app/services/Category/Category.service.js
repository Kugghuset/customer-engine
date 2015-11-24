(function () {
'use strict'

angular.module('customerEngineApp')
.factory('Category', ['$q', '$http', function ($q, $http) {
  
  return {
    getAllCategories: function () {
      return $q(function (resolve, reject) {
        $http.get('/api/categories/combined')
        .success(resolve)
        .error(reject);
      });
    }
  };
  
}]);

})();
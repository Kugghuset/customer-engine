(function (params) {
'use strict'

angular.module('customerEngineApp', [
  'ui.router',
  'ngCookies',
  'angular-google-analytics',
  'ngTagsInput'
])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider','AnalyticsProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, AnalyticsProvider) {
  
  $urlRouterProvider
  .otherwise('/hem');
  
  // Adds authInterceptor to http requests
  $httpProvider.interceptors.push('authInterceptor')
  
  // Analytics
  AnalyticsProvider.useAnalytics(false); // set to true when in prod
  AnalyticsProvider.setPageEvent('$stateChangeSuccess');
  AnalyticsProvider.setAccount([
    {
      tracker: 'UA-XXXXXXXX-X',
      name: 'customer-engine'
    }
  ]);
}])
.factory('authInterceptor', ['$q', '$cookies', '$location', function ($q, $cookies, $location) {
  return {
    // Add authorization token to headers
    request: function (config) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + ($cookies.get('token') ? $cookies.get('token') : '');
      return config;
    },
    // Intercepts 401s and redirects to home
    responseError: function (response) {
      if (response.status === 401) {
        $location.path('/hem');
        $cookies.remove('token');
      }
      
      return $q.reject(response);
    }
  }
}])
.run(['$rootScope', 'Auth', function ($rootScope, Auth) {
  var inRequest = false;
  
  // Auth.isLoggedInAsync()
  // .then(function (res) {
  //   console.log(res);
    
  // });
  
  $rootScope.$on('$stateChangeSuccess', function (event, net, params) {
   
   window.scrollTo(0,0);
  });
}]);

})();
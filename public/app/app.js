(function (params) {
'use strict'

angular.module('customerEngineApp', [
  'ui.router',
  'ngCookies',
  'ui.bootstrap',
  'ui-notification',
  'angular-google-analytics',
  'ngIntlTelInput',
  'LocalForageModule'
])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider','AnalyticsProvider', 'ngIntlTelInputProvider', '$localForageProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, AnalyticsProvider, ngIntlTelInputProvider, $localForageProvider) {
  
  $urlRouterProvider
  .otherwise('/home');
  
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
  
  // Settings for international phone numbers
  ngIntlTelInputProvider.set({
    defaultCountry: 'se',
    preferredCountries: [ 'se', 'no', 'fi', 'de' ],
    dropdownContainer: true
  });
  
  // Set default config for $localForageProvider
  $localForageProvider.config({
    name: 'customerEngineApp',
    storeName: 'tickets'
  })
}])
.factory('authInterceptor', ['$q', '$cookies', '$location', function ($q, $cookies, $location) {
  return {
    // Add authorization token to headers
    request: function (config) {
      config.headers = config.headers || {};
      
      config.headers.Authorization = 'Bearer ' + $cookies.get('token') || '';
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
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  var inRequest = false;
  
  Auth.isLoggedInAsync()
  .then(function (isLoggedIn) {
    if (!isLoggedIn) {
      $location.path('/hem');
    }
  });
  
  $rootScope.$on('$stateChangeSuccess', function (event, net, params) {
   
   window.scrollTo(0,0);
  });
}]);

})();
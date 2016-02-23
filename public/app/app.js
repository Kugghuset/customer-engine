(function (params) {
'use strict'

angular.module('ticketyApp', [
  'ui.router',
  'ngCookies',
  'ui.bootstrap',
  'ui-notification',
  'ngIntlTelInput',
  'LocalForageModule',
  'ngCacheBuster',
  'monospaced.elastic',
  'ngFileUpload',
  'templates'
])
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'ngIntlTelInputProvider', '$localForageProvider', 'httpRequestInterceptorCacheBusterProvider', 'NotificationProvider',
function ($stateProvider, $urlRouterProvider, $httpProvider, ngIntlTelInputProvider, $localForageProvider, httpRequestInterceptorCacheBusterProvider, NotificationProvider) {

  $urlRouterProvider
  .otherwise('/dashboard');

  // Adds authInterceptor to http requests
  $httpProvider.interceptors.push('authInterceptor')

  // Settings for international phone numbers
  ngIntlTelInputProvider.set({
    defaultCountry: 'se',
    preferredCountries: [ 'se', 'no', 'fi', 'de' ],
    dropdownContainer: true
  });

  // Set default config for $localForageProvider
  $localForageProvider.config({
    name: 'ticketyApp',
    storeName: 'tickets'
  });

  httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/],true);

  NotificationProvider.setOptions({
    positionX: 'right',
    startRight: 50
  });

}])
.factory('authInterceptor', ['$q', '$cookies', '$location', function ($q, $cookies, $location) {
  return {
    // Add authorization token to headers
    request: function (config) {
      config.headers = config.headers || {};
      
      console.log(config.headers);
      
      config.headers.Authorization = 'Bearer ' + $cookies.get('token') || '';
      return config;
    },
    // Intercepts 401s and redirects to home
    responseError: function (response) {
      if (response.status === 401) {
        $location.path('/login');
        $cookies.remove('token');
      }

      return $q.reject(response);
    }
  }
}])
.run(['$rootScope', '$location', '$state', 'StateHandler', 'Auth', function ($rootScope, $location, $state, StateHandler, Auth) {
  var inRequest = false;

  Auth.isLoggedInAsync()
  .then(function (isLoggedIn) {
    if (!isLoggedIn) {
      $location.path('/login');
    }
  });

  $rootScope.$on('$stateChangeStart', function (event, next, params) {
    
    // Logic moved to StateHandler service
    StateHandler.stateChangeStart(event, next, params, inRequest);
    
  });
  
  $rootScope.$on("$stateChangeCancel", function (event, next, params) {
    inRequest = false;
  });

  $rootScope.$on('$stateChangeSuccess', function (event, next, params) {
    inRequest = false
    $rootScope.title = next.title;
   window.scrollTo(0,0);
  });
}]);

})();

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
  'monospaced.elastic'
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
.run(['$rootScope', '$location', '$state', 'Auth', function ($rootScope, $location, $state, Auth) {
  var inRequest = false;
  
  Auth.isLoggedInAsync()
  .then(function (isLoggedIn) {
    if (!isLoggedIn) {
      $location.path('/login');
    }
  });

  $rootScope.$on('$stateChangeStart', function (event, next, params) {
    if (Auth.isLoggedIn()) {
      // User is logged in
      if (next.name === 'main.login') {
        if (event) { event.preventDefault(); }
        $state.transitionTo('main.dashboard');
      }
    } else {
      // User not logged in
      if (next.name !== 'main.login') {
        if (event) { event.preventDefault(); }
        $state.transitionTo('main.login');
      }
    }
  });
  
  $rootScope.$on('$stateChangeSuccess', function (event, net, params) {
   
   window.scrollTo(0,0);
  });
}]);

})();
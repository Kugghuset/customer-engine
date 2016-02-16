(function () {
'use strict'

angular.module('ticketyApp')
.factory('StateHandler', ['$state', 'Auth', function ($state, Auth) {
  
  /**
   * Prevents the default action
   * and transitions to the dashboard.
   * 
   * @param {Object} event
   */
  function goToDashbaord(event) {
    if (event) { event.preventDefault(); }
    $state.transitionTo('main.dashboard');
  }
  
  /**
   * Prevents the default action
   * and transitions to the login page.
   * 
   * @param {Object} event
   */
  function goToLogin(event) {
    if (event) { event.preventDefault(); }
    $state.transitionTo('main.login');
  }
  
  /**
     * @param {Object} user
     * @param {Object} event
     * @param {Object} next
     * @param {Object} params
     * @param {Boolean} inRequest
   */
  function handleTransition(user, event, next, params, inRequest) {
  
    user = user || Auth.getCurrentUser();
    
    switch (next.name) {
      case 'main.login':
        
        if ($state.current.name == 'main.dashboard') {
          if (event) { event.preventDefault(); }
        } else {
          goToDashbaord(event);
        }
        break;
      
      case 'main.admin':
        
        // Only admins and above are allowed
        if (user && user.role >= 10) {
          // Only for now, forward to call_back
          if (event) { event.preventDefault(); }
          $state.transitionTo('main.admin.call_back');
          
          return;
        }
        if (event) { event.preventDefault(); }
        
        break;
      
      default:
        break;
    }
  }
  
  return {
    
    /**
     * Handles access to restricted pages.
     * 
     * @param {Object} event
     * @param {Object} next
     * @param {Object} params
     * @param {Boolean} inRequest
     */
    stateChangeStart: function (event, next, params, inRequest) {
      
      var user = Auth.getCurrentUser();
      
      if (Auth.isLoggedIn() && user) {
        return handleTransition(user, event, next, params, inRequest);
      }
      
      if (!Auth.isLoggedIn()) {
        if (next.name !== 'main.login') { goToLogin(); }
        // return early
        return;
      }
      
      Auth.isLoggedInAsync(true)
      .then(function (_user) {
        // Go to login if there's no user
        if (!_user) { return goToLogin(); }
        
        return handleTransition(_user, event, next, params, inRequest);
      })
      ['catch'](function (err) {
        goToDashbaord(event);
      })
    }
  };
  
}]);

})();

(function () {
    'use strict';

    angular
      .module('thinkster.authentication.services')
      .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$http'];

    function Authentication($cookies, $http) {
      var Authentication = {
        register: register,
        login: login,
        logout: logout,
        getAuthenticatedAccount: getAuthenticatedAccount,
        isAuthenticated: isAuthenticated,
        setAuthenticatedAccount: setAuthenticatedAccount,
        unauthenticate: unauthenticate
      };

      return Authentication;

      function register(email, password, username, confirm_password) {
        return $http.post('/api/v1/accounts/', {
          username: username,
          password: password,
          email: email,
          confirm_password: confirm_password
        }).then(registerSuccessFn, loginErrorFn);
      }
      function registerSuccessFn(data, status, headers, config) {
        Authentication.login(email, password);
      }
      function registerErrorFn(data, status, headers, config) {
        console.log('error');
      }
      function login(email, password) {
        return $http.post('/api/v1/auth/login/', {
          email: email,
          password: password
        }).then(loginSuccessFn, loginErrorFn);
      }
      function loginSuccessFn(data, status, headers, config) {
        console.log(arguments);
        Authentication.setAuthenticatedAccount(data.data);
        window.location = '/';
      }
      function loginErrorFn(data, status, headers, config) {
        console.log('error!');
      }
      function getAuthenticatedAccount() {
        if (!$cookies.authenticatedAccount) {
          return;
        }
        return JSON.parse($cookies.authenticatedAccount);
      }
      function isAuthenticated() {
        return !!$cookies.authenticatedAccount;
      }
      function setAuthenticatedAccount(account) {
        $cookies.authenticatedAccount = JSON.stringify(account);
      }
      function unauthenticate() {
        delete $cookies.authenticatedAccount;
      }
      function logout() {
        return $http.post('/api/v1/auth/logout/').then(logoutSuccessFn, logoutErrorFn);
      }
      function logoutSuccessFn() {
        Authentication.unauthenticate();
        window.location = '/';
      }
      function logoutErrorFn() {
        console.log('error');
      }
    }
})();

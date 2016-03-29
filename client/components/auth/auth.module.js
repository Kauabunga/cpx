'use strict';

angular.module('cpxApp.auth', [
  'cpxApp.constants',
  'cpxApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });

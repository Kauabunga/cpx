'use strict';

angular.module('cpxApp', [
  'cpxApp.constants',
  'cpxApp.util',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',

  'ngStorage',
  'ngAnimate',
  'ngMaterial',
  'ngMessages',
  'formly',
  'angulartics',
  'angulartics.google.analytics',
  'smoothScroll',
  'sticky',
  'nvd3'
])
  .config(function($urlRouterProvider, $locationProvider, $anchorScrollProvider) {
    $urlRouterProvider.otherwise('/');

    $anchorScrollProvider.disableAutoScrolling();

    $locationProvider.html5Mode(true);
  });

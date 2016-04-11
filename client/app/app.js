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
  'sticky'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });

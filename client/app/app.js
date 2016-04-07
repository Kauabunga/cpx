'use strict';

angular.module('cpxApp', [
  'cpxApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'validation.match',

  'ngStorage',
  'ngMaterial',
  'formly',
  'angulartics',
  'angulartics.google.analytics'
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });

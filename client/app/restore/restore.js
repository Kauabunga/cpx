'use strict';

angular.module('cpxApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('restore', {
        url: '/restore/base64/:base64',
        templateUrl: '<div></div>',
        controller: 'RestoreCtrl'
      });

  });

'use strict';

angular.module('cpxApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.when('/cpx', '/cpx/');

    $stateProvider
      .state('cpx', {
        url: '/',
        templateUrl: 'app/cpx/cpx.html',
        controller: 'CpxCtrl'
        //abstract: true
      });

    //$stateProvider
    //  .state('cpx.form', {
    //    url: '/:step',
    //    views: {},
    //    resolve: {
    //      validateStep: ['$q', ($q) => { return $q.resolve(); }]
    //    }
    //  });
  });

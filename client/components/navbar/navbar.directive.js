'use strict';

angular.module('cpxApp')
  .directive('navbar', () => ({
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    replace: true,
    controller: 'NavbarController',
    controllerAs: 'nav'
  }));

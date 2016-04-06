'use strict';

angular.module('cpxApp')
  .directive('cpxWelcome', function () {
    return {
      templateUrl: 'components/cpx-welcome/cpx-welcome.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
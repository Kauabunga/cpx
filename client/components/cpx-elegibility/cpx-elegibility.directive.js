'use strict';

angular.module('cpxApp')
  .directive('cpxElegibility', function () {
    return {
      templateUrl: 'components/cpx-elegibility/cpx-elegibility.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
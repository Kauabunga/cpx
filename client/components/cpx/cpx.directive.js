'use strict';

angular.module('cpxApp')
  .directive('cpx', function ($log, cpx, $timeout) {
    return {
      templateUrl: 'components/cpx/cpx.html',
      restrict: 'E',
      replace: true,
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.model = cpx.getCurrentModel();

          scope.cpxForm = cpx.getCpxForm();

          $timeout(() => {
            scope.loaded = true;
          }, 100);

        }
      }
    };
  });

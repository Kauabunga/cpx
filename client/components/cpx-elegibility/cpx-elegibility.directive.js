'use strict';

angular.module('cpxApp')
  .directive('cpxElegibility', function ($log, cpx) {
    return {
      templateUrl: 'components/cpx-elegibility/cpx-elegibility.html',
      restrict: 'E',
      scope: {
        model: '=',
        fields: '=',
        namespace: '@'
      },
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.next = next;
          scope.getElegibilityModel = getElegibilityModel;
        }

        function next($event) {
          $log.debug(scope.model);
          return getElegibilityModel().complete = true;
        }

        function getElegibilityModel(){
          return scope.model[scope.namespace] ? scope.model[scope.namespace] : scope.model[scope.namespace] = {};
        }

      }
    };
  });

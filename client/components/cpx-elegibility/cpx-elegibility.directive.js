'use strict';

angular.module('cpxApp')
  .directive('cpxElegibility', function ($log, cpx, $timeout, smoothScroll) {
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

        function next(form) {
          $log.debug('elegibility next click', scope.model, form.$valid);
          if(form.$valid){
            return cpx.completeStep(scope.namespace);
          }
        }

        function getElegibilityModel(){
          return scope.model[scope.namespace] ? scope.model[scope.namespace] : scope.model[scope.namespace] = {};
        }

      }
    };
  });

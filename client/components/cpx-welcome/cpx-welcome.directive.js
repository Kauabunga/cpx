'use strict';

angular.module('cpxApp')
  .directive('cpxWelcome', function ($log, cpx) {
    return {
      templateUrl: 'components/cpx-welcome/cpx-welcome.html',
      restrict: 'E',
      scope: {
        model: '=',
        namespace: '@'
      },
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.start = start;
          scope.getWelcomeModel = getWelcomeModel;
        }

        function start($event){
          return cpx.completeStep(scope.namespace);
        }

        function getWelcomeModel(){
          return scope.model[scope.namespace] ? scope.model[scope.namespace] : scope.model[scope.namespace] = {};
        }
      }
    };
  });

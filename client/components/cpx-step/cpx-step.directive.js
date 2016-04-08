'use strict';

angular.module('cpxApp')
  .directive('cpxStep', function ($timeout, cpx, smoothScroll, $log) {
    return {
      templateUrl: 'components/cpx-step/cpx-step.html',
      restrict: 'E',
      transclude: true,
      scope: {
        name: '@',
        hideBack: '@'
      },
      link: function (scope, element, attrs) {

        //TODO Turn this into generic cpx-step

        return init();

        function init(){
          scope.undo = cpx.uncompleteStep;
          scope.stepBack = cpx.stepBack.bind(scope.name);

          //Add a timeout to the scroll so the user can register their click
          $timeout(scrollIfNotComplete, 150);
        }

        function scrollIfNotComplete(){
          if( ! isStepComplete()){
            smoothScroll(element[0]);
          }
        }

        function isStepComplete(){
          if(! getStepService().isComplete){throw new Error(`Step does not have isComplete method : ${scope.name}`);}
          return getStepService().isComplete();
        }

        function getStepService(){
          if(!cpx[scope.name]){throw new Error(`Step does not have service : ${scope.name}`);}
          return cpx[scope.name];
        }

      }
    };
  });

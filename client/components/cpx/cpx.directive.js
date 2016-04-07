'use strict';

angular.module('cpxApp')
  .directive('cpx', function ($log, cpx, $timeout) {
    return {
      templateUrl: 'components/cpx/cpx.html',
      restrict: 'E',
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.model = cpx.getCurrentModel();

          scope.isWelcomeActive = cpx.welcome.isActive;

          scope.isElegibilityActive = cpx.elegibility.isActive;
          scope.isElegibilityDisplayed = cpx.elegibility.isDisplayed;
          scope.isElegibilityComplete = cpx.elegibility.isComplete;

          scope.elegibilityFields = cpx.elegibility.getFields();

          scope.isCalculationActive = cpx.calculation.isActive;
          scope.isCalculationDisplayed = cpx.calculation.isDisplayed;

          $timeout(() => {
            //TODO smarten this up - each section should fade in automatically while still not rendering if not yet required
            scope.loaded = true;
          }, 100);

        }
      }
    };
  });

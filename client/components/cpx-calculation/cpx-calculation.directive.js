'use strict';

angular.module('cpxApp')
  .directive('cpxCalculation', function ($log, bic, levy, $timeout, cpx, smoothScroll) {
    return {
      templateUrl: 'components/cpx-calculation/cpx-calculation.html',
      restrict: 'E',
      scope: {
        model: '=',
        fields: '='
      },
      link: function (scope, element, attrs) {

        return init();

        function init(){
          scope.$watch(calculationWatcher, calculation);
          scope.bicSearchQuery = '';
          scope.searchBic = bic.search;
        }

        function getCalculationCacheKey() {
          try { return scope.selectedBic.cu + scope.earnings + scope.cover; }
          catch(err){ return ''; }
        }

        function calculationWatcher() {

          if(! scope.selectedBic || ! scope.selectedBic.cu ||
            ! scope.earnings || ! scope.cover){ return undefined; }

          scope.calculationCache = scope.calculationCache || {};

          let calculationCacheKey = getCalculationCacheKey();

          return scope.calculationCache[calculationCacheKey] ? scope.calculationCache[calculationCacheKey] :
            scope.calculationCache[calculationCacheKey] = {
            cuCode: scope.selectedBic.cu,
            earnings: scope.earnings,
            cover: scope.cover
          };
        }

        function calculation(params){

          let calculationCacheKey = getCalculationCacheKey();
          scope.cpxLevyRate = '';

          if(params){
            scope.isValidCalculation = true;
            return levy.calculate(params)
              .then(calculation => {
                if(calculationCacheKey === getCalculationCacheKey()){
                  scope.cpxLevyRate = calculation.totalWithoutGST.cpx;
                }
              });
          }
          else {
            scope.isValidCalculation = false;
          }

        }

      }
    };
  });

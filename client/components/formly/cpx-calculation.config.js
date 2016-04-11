
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'cpx-calculation',
    templateUrl: 'components/formly/cpx-calculation.html',
    controller: ['$scope', '$log', 'cpx', 'levy', 'Util', cpxCalculationController]
  });
});


function cpxCalculationController($scope, $log, cpx, levy, Util){

  const MAXIMUM_COVER = 120070;
  const MINIMUM_EARNINGS = 30680;
  const MINIMUM_COVER = 24544;

  return init();

  function init(){
    $log.debug(`cpx-calculation $scope`, $scope);
    $scope.$watch(calculationWatcher, calculation);
    $scope.$watch('model.earnings', maxEarningsWatcher);
    $scope.currencyFormat = Util.currencyFormat;
    $scope.mathMin = Math.min;
  }

  function getCalculationCacheKey() {
    try { return $scope.model.business.cu + $scope.model.earnings + $scope.model.cover; }
    catch(err){ return ''; }
  }

  function maxEarningsWatcher(earnings){
    $log.debug(`maxEarningsWatcher ${earnings}`);
    $log.debug(`maxEarningsWatcher ${earnings}`);
    if(earnings > MAXIMUM_COVER){
      $scope.model.cover = MAXIMUM_COVER;
    }
    if(earnings > $scope.model.cover){
      $scope.model.cover = Math.min(earnings, MAXIMUM_COVER);
    }
  }

  function calculationWatcher() {
    $log.debug(`calculationWatcher`, $scope.model);

    if(! $scope.model.business || ! $scope.model.business.cu ||
      ! $scope.model.earnings || ! $scope.model.cover){ return undefined; }

    $scope.calculationCache = $scope.calculationCache || {};

    let calculationCacheKey = getCalculationCacheKey();

    return $scope.calculationCache[calculationCacheKey] ?
        $scope.calculationCache[calculationCacheKey] :
        $scope.calculationCache[calculationCacheKey] = {
        cuCode: $scope.model.business.cu,
        earnings: Math.min($scope.model.earnings, MAXIMUM_COVER),
        cover: $scope.model.cover
      };
  }

  function calculation(params){

    $log.debug(`cpx-calculation calculation`, params);

    let calculationCacheKey = getCalculationCacheKey();

    if(params){

      if($scope.currentCuCalculation !== params.cuCode){
        $scope.model.cpCalculation = undefined;
        $scope.model.cpxCalculation = undefined;
      }
      else {
        if($scope.currentCpCalculationEarnings !== params.earnings){
          $scope.model.cpCalculation = undefined;
        }
        if($scope.currentCpxCalculationCover !== params.cover){
          $scope.model.cpxCalculation = undefined;
        }
      }

      //TODO debounce this if there is already a calculation running
      return levy.calculate(params)
        .then(calculation => {
          if(calculationCacheKey === getCalculationCacheKey()){

            $log.debug('Calculation', calculation);

            $scope.currentCuCalculation = params.cuCode;

            $scope.model.cpCalculation = calculation.totalWithGST.cpCurrency;
            $scope.model.cpxCalculation = calculation.totalWithGST.cpxCurrency;
            $scope.model.cpxLlwcCalculation = calculation.totalWithGST.cpxLlwcCurrency;

            $scope.currentCpCalculationEarnings = params.earnings;
            $scope.currentCpxCalculationCover = params.cover;
          }
        });
    }
    else {
      cpx.uncompleteStep('calculation');
      $scope.model.cpCalculation = undefined;
      $scope.model.cpxCalculation = undefined;
      $scope.currentCuCalculation = undefined;
    }

  }
}

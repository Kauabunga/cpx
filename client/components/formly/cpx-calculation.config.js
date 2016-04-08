
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

  return init();

  function init(){
    $log.debug(`cpx-calculation $scope`, $scope);
    $scope.$watch(calculationWatcher, calculation);
    $scope.currencyFormat = Util.currencyFormat;
  }

  function getCalculationCacheKey() {
    try { return $scope.model.business.cu + $scope.model.earnings + $scope.model.cover; }
    catch(err){ return ''; }
  }

  function calculationWatcher() {

    if(! $scope.model.business || ! $scope.model.business.cu ||
      ! $scope.model.earnings || ! $scope.model.cover){ return undefined; }

    $scope.calculationCache = $scope.calculationCache || {};

    let calculationCacheKey = getCalculationCacheKey();

    return $scope.calculationCache[calculationCacheKey] ?
        $scope.calculationCache[calculationCacheKey] :
        $scope.calculationCache[calculationCacheKey] = {
        cuCode: $scope.model.business.cu,
        earnings: $scope.model.earnings,
        cover: $scope.model.cover
      };
  }

  function calculation(params){

    $log.debug(`cpx-calculation calculation`, params);

    let calculationCacheKey = getCalculationCacheKey();

    if(params){

      if($scope.currentCpCalculationEarnings !== params.earnings){
        $scope.cpCalculation = undefined;
      }

      if($scope.currentCpxCalculationCover !== params.cover){
        $scope.cpxCalculation = undefined;
      }

      return levy.calculate(params)
        .then(calculation => {
          if(calculationCacheKey === getCalculationCacheKey()){

            $scope.cpCalculation = calculation.totalWithoutGST.cpCurrency;
            $scope.cpxCalculation = calculation.totalWithoutGST.cpxCurrency;

            $scope.currentCpCalculationEarnings = params.earnings;
            $scope.currentCpxCalculationCover = params.cover;
          }
        });
    }
    else {
      $scope.cpCalculation = undefined;
      $scope.cpxCalculation = undefined;
    }

  }
}

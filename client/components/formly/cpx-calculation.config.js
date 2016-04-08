
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'cpx-calculation',
    templateUrl: 'components/formly/cpx-calculation.html',
    controller: ['$scope', '$log', 'cpx', 'levy', cpxCalculationController]
  });
});


function cpxCalculationController($scope, $log, cpx, levy){

  return init();

  function init(){
    $log.debug(`cpx-calculation $scope`, $scope);
    $scope.$watch(calculationWatcher, calculation);
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

    return $scope.calculationCache[calculationCacheKey] ? $scope.calculationCache[calculationCacheKey] :
      $scope.calculationCache[calculationCacheKey] = {
        cuCode: $scope.model.business.cu,
        earnings: $scope.model.earnings,
        cover: $scope.model.cover
      };
  }

  function calculation(params){

    $log.debug(`cpx-calculation calculation`, params);

    let calculationCacheKey = getCalculationCacheKey();
    $scope.calculation = undefined;

    if(params){
      $scope.isValidCalculation = true;
      return levy.calculate(params)
        .then(calculation => {
          if(calculationCacheKey === getCalculationCacheKey()){
            $scope.calculation = calculation;
          }
        });
    }
    else {
      $scope.isValidCalculation = false;
    }

  }



}

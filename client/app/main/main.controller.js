'use strict';

(function() {

class MainController {

  constructor($http, $scope, bic, businessnames, $log, $timeout, addresslookup, levy) {

    this.bicSearchQuery = '';
    this.searchBic = bic.search;
    this.searchBusinessnames = businessnames.search;
    this.addressQuerySearch = addresslookup.searchAddress;


    this.getCalculationCacheKey = () => {
      try { return this.selectedBic.cu + this.earnings + this.cover; }
      catch(err){ return ''; }
    };

    this.calculationWatcher = () => {

      if(! this.selectedBic || ! this.selectedBic.cu ||
        ! this.earnings || ! this.cover){ return undefined; }

      this.calculationCache = this.calculationCache || {};

      let calculationCacheKey = this.getCalculationCacheKey();

      return this.calculationCache[calculationCacheKey] ? this.calculationCache[calculationCacheKey] : this.calculationCache[calculationCacheKey] = {
        cuCode: this.selectedBic.cu,
        earnings: this.earnings,
        cover: this.cover
      };
    };

    $scope.$watch(this.calculationWatcher, (params) => {
      $log.debug('calculationWatcher params', params);
      let calculationCacheKey = this.getCalculationCacheKey();
      this.cpxLevyRate = '';

      if(params){
        this.isValidCalculation = true;
        return levy.calculate(params)
        .then(calculation => {
            if(calculationCacheKey === this.getCalculationCacheKey()){
              this.cpxLevyRate = calculation.totalWithoutGST.cpx;
            }
          });
      }
      else {
        this.isValidCalculation = false;
      }
    });

  }

}

angular.module('cpxApp')
  .controller('MainController', MainController);

})();

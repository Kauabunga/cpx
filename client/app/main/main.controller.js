'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, bic, businessnames, $log, $timeout, levy) {
    this.$http = $http;
    this.awesomeThings = [];


    this.bicSearchQuery = '';
    this.searchBic = bic.search;
    this.searchBusinessnames = businessnames.search;

    bic.createSearchIndex();


    this.getCalculationCacheKey = () => {
      try { return this.selectedBic.cu + this.earnings + this.cover; }
      catch(err){ return ''; }
    };

    this.calculationWatcher = ($scope) => {

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
        return levy.calculate(params)
        .then(calculation => {
            if(calculationCacheKey === this.getCalculationCacheKey()){
              this.cpxLevyRate = calculation.totalWithoutGST.cpx;
            }
          });
      }
    });



    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
}

angular.module('cpxApp')
  .controller('MainController', MainController);

})();

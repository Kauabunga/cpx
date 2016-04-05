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


    const calculationWatcher = ($scope) => {

      if(! this.selectedBic || ! this.selectedBic.cu || ! this.selectedBic.cu.code ||
        ! this.earnings || ! this.cover){ return undefined; }

      this.calculationCache = this.calculationCache || {};
      let calculationCacheKey = this.selectedBic.cu.code + this.earnings + this.cover;

      return this.calculationCache[calculationCacheKey] ? this.calculationCache[calculationCacheKey] : this.calculationCache[calculationCacheKey] = {
        //cu: _.get(this, 'selectedBic.cu'),
        cuCode: this.selectedBic.cu.code,
        earnings: this.earnings,
        cover: this.cover
      };
    };

    $scope.$watch(calculationWatcher, (params) => {
      $log.debug('calculationWatcher params', params);
      if(params){
        levy.calculate(params)
        .then(calculation => {
            this.cpxLevyRate = calculation.totalWithoutGST.cpx;
          })
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

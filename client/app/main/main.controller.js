'use strict';

(function() {

class MainController {

  constructor($http, $scope, businessnames, $log, $timeout, addresslookup, levy) {


    this.searchBusinessnames = businessnames.search;
    this.addressQuerySearch = addresslookup.searchAddress;

  }

}

angular.module('cpxApp')
  .controller('MainController', MainController);

})();

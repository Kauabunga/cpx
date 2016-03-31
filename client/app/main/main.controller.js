'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, bic, addresslookup) {
    this.$http = $http;
    this.awesomeThings = [];


    this.bicSearchQuery = '';
    this.searchBic = bic.search;

    bic.createSearchIndex();

    this.addressQuerySearch = addresslookup.searchAddress;

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }

  test() {
    console.log("testing: " + this.selectedAddress);
    console.log("testing: " + this.addressSearchText);
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

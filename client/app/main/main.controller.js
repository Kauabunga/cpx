'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, bic) {
    this.$http = $http;
    this.awesomeThings = [];


    this.bicSearchQuery = '';
    this.searchBic = bic.search;

    bic.createSearchIndex();


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

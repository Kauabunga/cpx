'use strict';

angular.module('cpxApp')
  .service('businessnames', function ($http, $q) {


    this.search = query => {
      return ! query ? $q.when([]) : $http.get(`/api/businessnames/${query}`)
        .then(response => response.data);
    };

  });

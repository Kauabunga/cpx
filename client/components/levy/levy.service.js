'use strict';

angular.module('cpxApp')
  .service('levy', function ($http) {

    this.calculate = ({cuCode, earnings, cover} = {}) => {
      return $http.get(`/api/levys/calculate/${cuCode}/${earnings}/${cover}`, {cache: true})
        .then(response => response.data);
    };

  });

'use strict';

angular.module('cpxApp')
  .controller('CpxCtrl', function ($scope, $window, $timeout, $state) {

    $scope.reset = () => {
      $window.sessionStorage.clear();
      $timeout(() => { $window.location.reload(); });
    }
  });

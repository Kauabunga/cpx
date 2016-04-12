'use strict';

angular.module('cpxApp')
  .controller('CpxCtrl', function ($scope, $window, $timeout, $state, cpx) {

    $timeout(() => $scope.loaded = true, 200);

  });

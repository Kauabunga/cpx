'use strict';

angular.module('cpxApp')
  .controller('CpxCtrl', function ($scope, $window, $timeout, $state, cpx) {

    $scope.reset = () => {
      cpx.resetCurrentForm();
    }
  });

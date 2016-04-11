
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'cpx-apply',
    templateUrl: 'components/formly/cpx-apply.html',
    controller: ['$scope', '$log', 'cpx', 'levy', 'Util', 'bic', '$q', '$timeout', cpxApplyController]
  });
});


function cpxApplyController($scope, $log, cpx, levy, Util, bic, $q, $timeout){


  return init();

  function init(){
    $scope.currencyFormat = Util.currencyFormat;

  }

}

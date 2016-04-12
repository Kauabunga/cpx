
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'cpx-elegibility',
    template: '',
    controller: ['$scope', '$log', 'cpx', 'levy', '$timeout', cpxElegibilityController]
  });
});


function cpxElegibilityController($scope, $log, cpx, levy, $timeout, $sessionStorage){



  return init();

  function init(){

    $log.debug(`cpx-elegibility $scope`, $scope);
    $scope.$watch('model', elegibility, true);
    $scope.$watch('form.$invalid', elegibility);
  }

  function elegibility(){
    $log.debug(`cpx-elegibility`, $scope.model, $scope.form);

    if($scope.form.$invalid || isNotElegibile($scope.model)){
      cpx.uncompleteStep('elegibility');

      //TODO ensure this doesn't attempt to scroll on load
      //$timeout(() => {cpx.scrollToStep('elegibility');});
    }
  }

  //TODO pass in from formly model definition
  function isNotElegibile(model){
    return ( model.selfEmployed === 'no' &&
        model.soleTrader === 'sole' &&
        model.hoursThreshold === 'no' &&
        model.earnThreshold === 'no' ) ||

        (model.hoursThreshold === 'no' && model.earnThreshold === 'no') ||

        (model.soleTrader !== 'sole') ||

        (model.selfEmployed === 'no');
  }
}

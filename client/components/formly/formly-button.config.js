
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'button',
    templateUrl: 'components/formly/formly-button.html',
    defaultOptions: {
      templateOptions: {
        type: 'button'
      }
    },
    controller: ['$scope', buttonController]
  });
});

function buttonController($scope){
  return init();

  function init(){
    $scope.to.label = $scope.to.label || 'to.label';
    $scope.getButtonLabel = getButtonLabel;
  }

  function getButtonLabel(){
    return typeof $scope.to.label === 'function' ? $scope.to.label() : $scope.to.label;
  }
}


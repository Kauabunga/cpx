
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'radio',
    templateUrl: 'components/formly/formly-radio.html',
    controller: ['$scope', radioController]
  });
});

function radioController($scope){
  return init();

  function init(){
    $scope.getRadioLabel = getRadioLabel;
  }

  function getRadioLabel(label){
    return typeof label === 'function' ? label($scope) : label;
  }
}


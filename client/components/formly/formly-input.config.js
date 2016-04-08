
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'input',
    templateUrl: 'components/formly/formly-input.html'
  });
});

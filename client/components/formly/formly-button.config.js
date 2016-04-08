
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
    }
  });
});

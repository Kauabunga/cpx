
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'radio',
    templateUrl: 'components/formly/formly-radio.html'
  });
});

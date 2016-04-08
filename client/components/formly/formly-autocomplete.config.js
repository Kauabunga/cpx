
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'autocomplete',
    templateUrl: 'components/formly/formly-autocomplete.html'
  });
});

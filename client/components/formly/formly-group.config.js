
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'group',
    templateUrl: 'components/formly/formly-group.html'
  });
});

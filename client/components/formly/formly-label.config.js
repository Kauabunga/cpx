
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'label',
    template: '<label><p><strong>{{::to.label}}</strong></p></label>'
  });
});

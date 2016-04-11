
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'label',
    template: '<label>{{::to.label}}</label>'
  });
});

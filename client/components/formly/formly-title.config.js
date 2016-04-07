
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'title',
    template: '<h1>{{::to.label}}</h1>'
  });
});

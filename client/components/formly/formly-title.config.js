
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'title',
    template: '<h1 class="formly-title {{::to.class}}">{{::to.label}}</h1>'
  });
});

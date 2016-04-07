
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'paragraph',
    template: '<p>{{::to.label}}</p>'
  });
});

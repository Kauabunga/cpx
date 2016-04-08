
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'html',
    template: '<div ng-bind-html="::to.label"></div>'
  });
});

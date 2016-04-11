
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'html',
    template: '<div class="{{::to.className}}" ng-bind-html="::to.label"></div>'
  });
});

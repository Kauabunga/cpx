
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'autoscroll',
    template: '<div smooth-scroll></div>'
  });
});

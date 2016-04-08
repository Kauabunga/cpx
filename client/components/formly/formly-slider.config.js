
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'slider',
    templateUrl: 'components/formly/formly-slider.html'
  });
});

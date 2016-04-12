
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'autoscroll',
    template: '<div scroll></div>'
  });
});

angular.module('cpxApp')
  .directive('scroll', function (scroll, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $timeout(() => scroll.scrollTo(element[0]));
      }
    }
  });

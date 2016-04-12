
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'link',
    template: '<a ng-click="to.onClick($event, model, form)" href="{{::to.href}}" target="{{to.target ? to.target : "_blank"}}">{{::to.label}}</a>'
  });
});

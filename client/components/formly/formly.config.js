
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {


    formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

});

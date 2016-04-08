
'use strict';

angular.module('cpxApp')
    .config(function config(formlyConfigProvider) {
        formlyConfigProvider.setWrapper({
            name: 'validation',
            types: ['input'],
            templateUrl: 'components/formly/formly-validation.html'
        });
    });

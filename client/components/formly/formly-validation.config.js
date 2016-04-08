
'use strict';

angular.module('cpxApp')
    .config(function config(formlyConfigProvider) {
        formlyConfigProvider.setWrapper({
            name: 'validation',
            //TODO add radio validation to this
            types: ['input'],
            templateUrl: 'components/formly/formly-validation.html'
        });
    });

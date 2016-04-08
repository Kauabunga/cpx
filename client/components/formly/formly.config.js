
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {

    formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

});

angular.module('cpxApp')
.run(function config(formlyValidationMessages) {

    formlyValidationMessages.addStringMessage('required', 'This field is required');
    formlyValidationMessages.addStringMessage('min', 'This value is too small');
    formlyValidationMessages.addStringMessage('max', 'This value is too large');

});


'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {

    formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

});

angular.module('cpxApp')
.run(function config(formlyValidationMessages) {

    formlyValidationMessages.addStringMessage('required', 'This field is required');
    formlyValidationMessages.addStringMessage('pattern', 'This field does not match the pattern');
    formlyValidationMessages.addStringMessage('min', 'This value is too small');
    formlyValidationMessages.addStringMessage('max', 'This value is too large');

    formlyValidationMessages.addTemplateOptionValueMessage('min', 'min', 'The min value allowed is', '', 'Too small');
    formlyValidationMessages.addTemplateOptionValueMessage('max', 'max', 'The max value allowed is', '', 'Too big');

});


'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {

    formlyConfigProvider.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';

});

angular.module('cpxApp')
.run(function config(formlyValidationMessages) {

    formlyValidationMessages.addStringMessage('required', 'This field is required');
    //formlyValidationMessages.addStringMessage('pattern', 'This field does not match the pattern');
    //formlyValidationMessages.addStringMessage('min', 'This value is too small');
    //formlyValidationMessages.addStringMessage('max', 'This value is too large');

    formlyValidationMessages.addTemplateOptionValueMessage('min', 'minValidationMessage', 'The min value allowed is', '', 'Too small');
    formlyValidationMessages.addTemplateOptionValueMessage('max', 'maxValidationMessage', 'The max value allowed is', '', 'Too big');
    formlyValidationMessages.addTemplateOptionValueMessage('pattern', 'patternValidationMessage', '', '', 'Invalid Input');


  });

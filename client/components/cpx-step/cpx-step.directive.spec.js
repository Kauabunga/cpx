'use strict';

describe('Directive: cpxStep', function () {

  // load the directive's module and view
  beforeEach(module('cpxApp'));
  beforeEach(module('components/cpx-step/cpx-step.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

});

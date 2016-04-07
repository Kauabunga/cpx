'use strict';

describe('Directive: cpxCalculation', function () {

  // load the directive's module and view
  beforeEach(module('cpxApp'));
  beforeEach(module('components/cpx-calculation/cpx-calculation.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<cpx-calculation></cpx-calculation>');
  //  element = $compile(element)(scope);
  //  scope.$apply();
  //  element.text().should.equal('this is the cpxCalculation directive');
  //}));
});

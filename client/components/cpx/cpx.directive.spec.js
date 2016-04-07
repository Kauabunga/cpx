'use strict';

describe('Directive: cpx', function () {

  // load the directive's module and view
  beforeEach(module('cpxApp'));
  beforeEach(module('components/cpx/cpx.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<cpx></cpx>');
  //  element = $compile(element)(scope);
  //  scope.$apply();
  //  element.text().should.equal('this is the cpx directive');
  //}));
});

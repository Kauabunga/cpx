'use strict';

describe('Directive: cpxElegibility', function () {

  // load the directive's module and view
  beforeEach(module('cpxApp'));
  beforeEach(module('components/cpx-elegibility/cpx-elegibility.html'));

  var element, scope, $httpBackend;

  beforeEach(inject(function ($rootScope, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();

    //TODO why is this template not being packaged up as part of the .js bundle?
    $httpBackend.expectGET('app/main/main.html').respond(200, '');
  }));

  //it('should make hidden element visible', inject(function ($compile) {
  //  element = angular.element('<cpx-elegibility></cpx-elegibility>');
  //  element = $compile(element)(scope);
  //  scope.$apply();
  //  expect(element.text()).toBe('this is the cpxElegibility directive');
  //}));
});

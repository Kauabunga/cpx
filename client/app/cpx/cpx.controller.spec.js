'use strict';

describe('Controller: CpxCtrl', function () {

  // load the controller's module
  beforeEach(module('cpxApp'));

  var CpxCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CpxCtrl = $controller('CpxCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});

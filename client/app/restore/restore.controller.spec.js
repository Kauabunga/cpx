'use strict';

describe('Controller: RestoreCtrl', function () {

  // load the controller's module
  beforeEach(module('cpxApp'));

  var RestoreCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RestoreCtrl = $controller('RestoreCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});

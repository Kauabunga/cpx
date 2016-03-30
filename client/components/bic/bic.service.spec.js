'use strict';

describe('Service: bic', function () {

  // load the service's module
  beforeEach(module('cpxApp'));

  // instantiate service
  var bic;
  beforeEach(inject(function (_bic_) {
    bic = _bic_;
  }));

  it('should do something', function () {
    !!bic.should.be.true;
  });

});

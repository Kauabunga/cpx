'use strict';

describe('Service: businessnames', function () {

  // load the service's module
  beforeEach(module('cpxApp'));

  // instantiate service
  var businessnames;
  beforeEach(inject(function (_businessnames_) {
    businessnames = _businessnames_;
  }));

  it('should do something', function () {
    !!businessnames.should.be.true;
  });

});
